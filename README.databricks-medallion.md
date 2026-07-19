# Databricks ETL Medallion Pipeline

A simplified, interview-focused example of moving order data through the Bronze, Silver, and Gold layers in Databricks.

## The Medallion Pattern

- Bronze stores raw source data and ingestion metadata.
- Silver validates, cleans, and deduplicates the raw data.
- Gold aggregates the clean data for reporting and analytics.

The data becomes more useful as it moves through each layer:

`JSON files → Bronze Delta table → Silver Delta table → Gold Delta table`

## Example Input

Each incoming JSON record looks like this:

```json
{
  "order_id": "ORD-1001",
  "customer_id": "C-42",
  "order_time": "2026-07-19T14:30:00Z",
  "status": "COMPLETED",
  "amount": 125.5
}
```

## Complete Databricks Notebook

```python
# Databricks notebook source
from pyspark.sql import Window
from pyspark.sql import functions as F
from pyspark.sql.types import (
    DoubleType,
    StringType,
    StructField,
    StructType,
    TimestampType,
)


# COMMAND ----------

# Create the catalog and schemas used by the pipeline.
CATALOG = "example"
BRONZE = f"{CATALOG}.bronze"
SILVER = f"{CATALOG}.silver"
GOLD = f"{CATALOG}.gold"

spark.sql(f"CREATE CATALOG IF NOT EXISTS {CATALOG}")
spark.sql(f"CREATE SCHEMA IF NOT EXISTS {BRONZE}")
spark.sql(f"CREATE SCHEMA IF NOT EXISTS {SILVER}")
spark.sql(f"CREATE SCHEMA IF NOT EXISTS {GOLD}")
spark.sql(f"CREATE VOLUME IF NOT EXISTS {BRONZE}.landing")
spark.sql(f"CREATE VOLUME IF NOT EXISTS {BRONZE}.checkpoints")


# COMMAND ----------

# Define the expected structure instead of asking Spark to infer it.
order_schema = StructType(
    [
        StructField("order_id", StringType(), False),
        StructField("customer_id", StringType(), False),
        StructField("order_time", TimestampType(), False),
        StructField("status", StringType()),
        StructField("amount", DoubleType()),
    ]
)


# COMMAND ----------

# BRONZE: incrementally ingest new JSON files with Auto Loader.
landing_path = f"/Volumes/{CATALOG}/bronze/landing/orders"
checkpoint_path = f"/Volumes/{CATALOG}/bronze/checkpoints/orders"

bronze_stream = (
    spark.readStream.format("cloudFiles")
    .option("cloudFiles.format", "json")
    .schema(order_schema)
    .load(landing_path)
    .withColumn("_source_file", F.col("_metadata.file_path"))
    .withColumn("_ingested_at", F.current_timestamp())
)

(
    bronze_stream.writeStream.format("delta")
    .option("checkpointLocation", checkpoint_path)
    .trigger(availableNow=True)
    .toTable(f"{BRONZE}.orders")
    .awaitTermination()
)


# COMMAND ----------

# SILVER: clean, validate, and keep the newest copy of each order.
dedupe_window = Window.partitionBy("order_id").orderBy(
    F.col("_ingested_at").desc()
)

silver_orders = (
    spark.table(f"{BRONZE}.orders")
    .filter(F.col("order_id").isNotNull())
    .filter(F.col("customer_id").isNotNull())
    .filter(F.col("order_time").isNotNull())
    .filter(F.col("amount") >= 0)
    .withColumn("status", F.lower(F.trim("status")))
    .withColumn("_row_number", F.row_number().over(dedupe_window))
    .filter(F.col("_row_number") == 1)
    .drop("_row_number")
)

(
    silver_orders.write.format("delta")
    .mode("overwrite")
    .option("overwriteSchema", "true")
    .saveAsTable(f"{SILVER}.orders")
)


# COMMAND ----------

# GOLD: create a small business-level table for dashboards.
spark.sql(
    f"""
    CREATE OR REPLACE TABLE {GOLD}.daily_sales
    USING DELTA
    AS
    SELECT
      DATE(order_time) AS order_date,
      COUNT(*) AS order_count,
      COUNT(DISTINCT customer_id) AS customer_count,
      ROUND(SUM(amount), 2) AS revenue
    FROM {SILVER}.orders
    WHERE status = 'completed'
    GROUP BY DATE(order_time)
    """
)

display(spark.table(f"{GOLD}.daily_sales"))
```

## What Each Databricks Feature Does

| Feature | Purpose |
|---|---|
| Auto Loader | Finds and incrementally processes new files from cloud storage. |
| Checkpoint | Tracks streaming progress so files are not processed repeatedly. |
| Delta Lake | Adds reliable tables, schema enforcement, and transaction support. |
| Spark DataFrame | Performs transformations such as filtering and deduplication. |
| Spark SQL | Expresses reporting and aggregation logic clearly. |
| Unity Catalog | Organizes and governs catalogs, schemas, tables, and volumes. |

## How to Explain It in an Interview

The pipeline incrementally loads raw JSON files into a Bronze Delta table. A Silver transformation removes invalid records, normalizes values, and deduplicates orders. A Gold transformation then aggregates completed orders into daily business metrics. Auto Loader handles incremental file discovery, checkpoints preserve ingestion progress, and Delta Lake provides reliable storage between each stage.

## Common Interview Questions

### Why keep a Bronze layer?

It preserves the original source data. If transformation rules change, Silver and Gold can be rebuilt without requesting the source data again.

### Why use a checkpoint?

Structured Streaming records its progress in the checkpoint. When the job runs again, it continues from where it stopped instead of rereading every file.

### Why define a schema?

An explicit schema makes types predictable, catches malformed data earlier, and avoids expensive schema inference.

### Is Auto Loader always streaming?

Auto Loader uses Spark Structured Streaming, but `trigger(availableNow=True)` processes all currently available files and then stops. This works well for scheduled incremental batch jobs.

### What makes the pipeline idempotent?

The checkpoint prevents duplicate file ingestion, and the Silver window keeps only the newest row for each `order_id`. In a production pipeline, a Delta `MERGE` is often used instead of overwriting the full Silver table.
