# Django Reference Guide

Use this as a practical reference for the Django patterns you will need most often: project layout, models, views, services, URLs, filtering, sorting, ORM queries, forms, APIs, auth, testing, and settings.

## Common Project Structure

| File Or Folder | Purpose |
| --- | --- |
| `manage.py` | Runs Django commands like migrations, tests, and the dev server |
| `config/settings.py` | Project settings, installed apps, middleware, database, static files |
| `config/urls.py` | Root URL routes for the whole project |
| `app/models.py` | Database tables as Python classes |
| `app/views.py` | Request handlers that return responses |
| `app/urls.py` | Routes for one app |
| `app/forms.py` | HTML form validation and cleaning |
| `app/services.py` | Business logic that should not live directly in views |
| `app/selectors.py` | Reusable read/query logic |
| `app/admin.py` | Django admin configuration |
| `app/tests.py` or `app/tests/` | Unit and integration tests |
| `app/migrations/` | Database migration files |

Basic app layout:

```text
project/
  manage.py
  config/
    settings.py
    urls.py
    wsgi.py
    asgi.py
  users/
    models.py
    views.py
    urls.py
    services.py
    selectors.py
    forms.py
    admin.py
    tests.py
```

## Install And Start

```powershell
python -m venv .venv
.\.venv\Scripts\activate
pip install django
django-admin startproject config .
python manage.py startapp users
python manage.py runserver
```

Add your app to `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "users",
]
```

## Models

Models define database tables.

```python
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Project(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="projects")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["name"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return self.name
```

## Common Field Types

| Field | Use |
| --- | --- |
| `CharField(max_length=...)` | Short text |
| `TextField()` | Long text |
| `IntegerField()` | Whole numbers |
| `DecimalField(max_digits=10, decimal_places=2)` | Money and precise decimals |
| `BooleanField(default=False)` | True or false |
| `DateTimeField(auto_now_add=True)` | Created timestamp |
| `DateTimeField(auto_now=True)` | Updated timestamp |
| `ForeignKey(Model, on_delete=...)` | Many-to-one relation |
| `OneToOneField(Model, on_delete=...)` | One-to-one relation |
| `ManyToManyField(Model)` | Many-to-many relation |
| `JSONField(default=dict)` | Flexible JSON data |

## Migrations

Create and apply database changes.

```powershell
python manage.py makemigrations
python manage.py migrate
python manage.py showmigrations
```

Useful reset during local development only:

```powershell
python manage.py migrate app_name zero
python manage.py migrate
```

## URLs

Root `config/urls.py`:

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("projects/", include("projects.urls")),
]
```

App `projects/urls.py`:

```python
from django.urls import path
from . import views

app_name = "projects"

urlpatterns = [
    path("", views.project_list, name="list"),
    path("<int:project_id>/", views.project_detail, name="detail"),
    path("create/", views.project_create, name="create"),
]
```

## Function Views

Function views are simple and explicit.

```python
from django.shortcuts import get_object_or_404, redirect, render
from .models import Project
from .services import create_project


def project_list(request):
    projects = Project.objects.filter(is_active=True)

    return render(request, "projects/list.html", {
        "projects": projects,
    })


def project_detail(request, project_id):
    project = get_object_or_404(Project, id=project_id)

    return render(request, "projects/detail.html", {
        "project": project,
    })


def project_create(request):
    if request.method == "POST":
        project = create_project(
            owner=request.user,
            name=request.POST["name"],
            description=request.POST.get("description", ""),
        )
        return redirect("projects:detail", project_id=project.id)

    return render(request, "projects/create.html")
```

## Class-Based Views

Class-based views are useful for standard CRUD pages.

```python
from django.urls import reverse_lazy
from django.views.generic import CreateView, DetailView, ListView, UpdateView
from .models import Project


class ProjectListView(ListView):
    model = Project
    template_name = "projects/list.html"
    context_object_name = "projects"
    paginate_by = 25

    def get_queryset(self):
        return Project.objects.filter(is_active=True).order_by("-created_at")


class ProjectDetailView(DetailView):
    model = Project
    template_name = "projects/detail.html"
    context_object_name = "project"


class ProjectCreateView(CreateView):
    model = Project
    fields = ["name", "description"]
    template_name = "projects/form.html"
    success_url = reverse_lazy("projects:list")

    def form_valid(self, form):
        form.instance.owner = self.request.user
        return super().form_valid(form)
```

## Services

Use services for business logic. This keeps views thin and easier to test.

```python
from django.db import transaction
from .models import Project


@transaction.atomic
def create_project(*, owner, name: str, description: str = "") -> Project:
    project = Project.objects.create(
        owner=owner,
        name=name,
        description=description,
    )

    return project


@transaction.atomic
def archive_project(*, project: Project) -> Project:
    project.is_active = False
    project.save(update_fields=["is_active", "updated_at"])
    return project
```

## Selectors

Use selectors for reusable query/read logic.

```python
from django.db.models import QuerySet
from .models import Project


def active_projects() -> QuerySet[Project]:
    return Project.objects.filter(is_active=True)


def projects_for_user(*, user) -> QuerySet[Project]:
    return active_projects().filter(owner=user)
```

## ORM Basics

| Goal | Query |
| --- | --- |
| Get all rows | `Project.objects.all()` |
| Filter rows | `Project.objects.filter(is_active=True)` |
| Get one row or 404 | `get_object_or_404(Project, id=project_id)` |
| Get one row or error | `Project.objects.get(id=project_id)` |
| Create row | `Project.objects.create(name="Website")` |
| Update row | `Project.objects.filter(id=id).update(name="New name")` |
| Delete row | `Project.objects.filter(id=id).delete()` |
| Sort newest first | `Project.objects.order_by("-created_at")` |
| Limit rows | `Project.objects.all()[:10]` |
| Count rows | `Project.objects.count()` |
| Check exists | `Project.objects.filter(name=name).exists()` |

## Filtering

Common filters:

```python
Project.objects.filter(is_active=True)
Project.objects.filter(name="Website")
Project.objects.filter(name__icontains="site")
Project.objects.filter(created_at__gte=start_date)
Project.objects.filter(created_at__lte=end_date)
Project.objects.filter(owner=request.user)
```

Multiple filters chain together:

```python
projects = Project.objects.filter(is_active=True)

if search:
    projects = projects.filter(name__icontains=search)

if owner_id:
    projects = projects.filter(owner_id=owner_id)
```

Use `Q` for OR queries:

```python
from django.db.models import Q

projects = Project.objects.filter(
    Q(name__icontains=query) | Q(description__icontains=query)
)
```

## Sorting

Simple sorting:

```python
Project.objects.order_by("name")
Project.objects.order_by("-created_at")
```

Safe user-controlled sorting:

```python
ALLOWED_SORTS = {
    "name": "name",
    "-name": "-name",
    "created": "created_at",
    "-created": "-created_at",
}

sort = request.GET.get("sort", "-created")
order_by = ALLOWED_SORTS.get(sort, "-created_at")

projects = Project.objects.order_by(order_by)
```

## Search, Filter, Sort View

This is a common list-page pattern.

```python
from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import render
from .models import Project


def project_list(request):
    query = request.GET.get("q", "").strip()
    status = request.GET.get("status", "active")
    sort = request.GET.get("sort", "-created")

    projects = Project.objects.all()

    if query:
        projects = projects.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )

    if status == "active":
        projects = projects.filter(is_active=True)
    elif status == "archived":
        projects = projects.filter(is_active=False)

    allowed_sorts = {
        "name": "name",
        "-name": "-name",
        "created": "created_at",
        "-created": "-created_at",
    }
    projects = projects.order_by(allowed_sorts.get(sort, "-created_at"))

    paginator = Paginator(projects, 25)
    page = request.GET.get("page")
    page_obj = paginator.get_page(page)

    return render(request, "projects/list.html", {
        "page_obj": page_obj,
        "query": query,
        "status": status,
        "sort": sort,
    })
```

## Pagination

```python
from django.core.paginator import Paginator

paginator = Paginator(Project.objects.all(), 25)
page_number = request.GET.get("page")
page_obj = paginator.get_page(page_number)
```

Template:

```html
{% for project in page_obj %}
  <p>{{ project.name }}</p>
{% endfor %}

{% if page_obj.has_previous %}
  <a href="?page={{ page_obj.previous_page_number }}">Previous</a>
{% endif %}

Page {{ page_obj.number }} of {{ page_obj.paginator.num_pages }}

{% if page_obj.has_next %}
  <a href="?page={{ page_obj.next_page_number }}">Next</a>
{% endif %}
```

## Forms

Use forms for validation and cleaned data.

```python
from django import forms
from .models import Project


class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ["name", "description"]

    def clean_name(self):
        name = self.cleaned_data["name"].strip()

        if len(name) < 3:
            raise forms.ValidationError("Name must be at least 3 characters.")

        return name
```

View with form:

```python
from django.shortcuts import redirect, render
from .forms import ProjectForm


def project_create(request):
    if request.method == "POST":
        form = ProjectForm(request.POST)

        if form.is_valid():
            project = form.save(commit=False)
            project.owner = request.user
            project.save()
            return redirect("projects:detail", project_id=project.id)
    else:
        form = ProjectForm()

    return render(request, "projects/form.html", {"form": form})
```

## Templates

Basic template syntax:

```html
<h1>{{ project.name }}</h1>
<p>{{ project.description }}</p>

{% if project.is_active %}
  <span>Active</span>
{% endif %}

{% for task in project.tasks.all %}
  <p>{{ task.title }}</p>
{% empty %}
  <p>No tasks yet.</p>
{% endfor %}
```

Template inheritance:

```html
{% extends "base.html" %}

{% block content %}
  <h1>Projects</h1>
{% endblock %}
```

## Admin

```python
from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["name", "owner", "is_active", "created_at"]
    list_filter = ["is_active", "created_at"]
    search_fields = ["name", "description", "owner__username"]
    ordering = ["-created_at"]
```

## Relationships And Query Performance

Use `select_related` for `ForeignKey` and `OneToOneField`.

```python
projects = Project.objects.select_related("owner")
```

Use `prefetch_related` for `ManyToManyField` and reverse relations.

```python
projects = Project.objects.prefetch_related("tasks")
```

Bad pattern:

```python
for project in Project.objects.all():
    print(project.owner.username)
```

Better:

```python
for project in Project.objects.select_related("owner"):
    print(project.owner.username)
```

## Aggregates And Annotations

```python
from django.db.models import Count

projects = Project.objects.annotate(task_count=Count("tasks"))

for project in projects:
    print(project.name, project.task_count)
```

Common aggregate:

```python
from django.db.models import Avg, Count, Max, Min, Sum

Project.objects.count()
Project.objects.aggregate(total=Count("id"))
```

## Authentication

Protect a function view:

```python
from django.contrib.auth.decorators import login_required


@login_required
def dashboard(request):
    return render(request, "dashboard.html")
```

Protect a class-based view:

```python
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView


class ProjectListView(LoginRequiredMixin, ListView):
    model = Project
```

## Permissions

Check ownership in the queryset.

```python
def project_detail(request, project_id):
    project = get_object_or_404(Project, id=project_id, owner=request.user)

    return render(request, "projects/detail.html", {"project": project})
```

Or use a helper:

```python
def can_edit_project(*, user, project):
    return user.is_staff or project.owner_id == user.id
```

## Django REST Framework Basics

Install:

```powershell
pip install djangorestframework
```

Add app:

```python
INSTALLED_APPS = [
    # ...
    "rest_framework",
]
```

Serializer:

```python
from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "name", "description", "is_active", "created_at"]
```

API view:

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectSerializer


@api_view(["GET"])
def project_list_api(request):
    projects = Project.objects.filter(is_active=True)
    serializer = ProjectSerializer(projects, many=True)

    return Response(serializer.data)
```

ViewSet:

```python
from rest_framework import viewsets
from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user)
```

Router:

```python
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet

router = DefaultRouter()
router.register("projects", ProjectViewSet, basename="project")

urlpatterns = [
    path("api/", include(router.urls)),
]
```

## Settings You Usually Need

```python
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("SECRET_KEY", "dev-only-secret-key")
DEBUG = os.environ.get("DEBUG", "False") == "True"
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"
```

Database example:

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["POSTGRES_DB"],
        "USER": os.environ["POSTGRES_USER"],
        "PASSWORD": os.environ["POSTGRES_PASSWORD"],
        "HOST": os.environ.get("POSTGRES_HOST", "localhost"),
        "PORT": os.environ.get("POSTGRES_PORT", "5432"),
    }
}
```

## Static Files

For production:

```powershell
python manage.py collectstatic
```

Common settings:

```python
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
```

## Environment Variables

Never hardcode secrets in code.

```python
import os

SECRET_KEY = os.environ["SECRET_KEY"]
DEBUG = os.environ.get("DEBUG", "False") == "True"
```

## Tests

Model/service test:

```python
from django.test import TestCase
from django.contrib.auth import get_user_model
from .services import create_project

User = get_user_model()


class ProjectServiceTests(TestCase):
    def test_create_project(self):
        user = User.objects.create_user(username="alex", password="password")

        project = create_project(
            owner=user,
            name="Website",
            description="Build landing page",
        )

        self.assertEqual(project.owner, user)
        self.assertEqual(project.name, "Website")
```

View test:

```python
from django.test import TestCase
from django.urls import reverse


class ProjectViewTests(TestCase):
    def test_project_list_loads(self):
        response = self.client.get(reverse("projects:list"))

        self.assertEqual(response.status_code, 200)
```

## Management Commands

Create `app/management/commands/close_inactive_projects.py`.

```python
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Close inactive projects"

    def handle(self, *args, **options):
        self.stdout.write("Closing inactive projects...")
```

Run:

```powershell
python manage.py close_inactive_projects
```

## Signals

Use signals sparingly. Services are usually easier to follow and test.

```python
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Project


@receiver(post_save, sender=Project)
def project_saved(sender, instance, created, **kwargs):
    if created:
        print(f"Project created: {instance.id}")
```

## Common Commands

| Command | Purpose |
| --- | --- |
| `python manage.py runserver` | Start local dev server |
| `python manage.py startapp app_name` | Create a new app |
| `python manage.py makemigrations` | Create migration files |
| `python manage.py migrate` | Apply migrations |
| `python manage.py createsuperuser` | Create admin user |
| `python manage.py shell` | Open Django shell |
| `python manage.py test` | Run tests |
| `python manage.py collectstatic` | Collect static files for production |

## What Goes Where

| Code | Put It In |
| --- | --- |
| Database fields and relationships | `models.py` |
| HTTP request and response handling | `views.py` |
| URL paths | `urls.py` |
| Business rules and writes | `services.py` |
| Reusable reads and querysets | `selectors.py` |
| Form validation | `forms.py` |
| API input/output shape | `serializers.py` |
| Admin table/search/filter config | `admin.py` |
| Reusable template HTML | `templates/` |
| Tests | `tests.py` or `tests/` |

## Rule Of Thumb

Keep models focused on data shape, views focused on HTTP, services focused on business logic, selectors focused on reusable queries, and forms or serializers focused on validation. Use `filter`, `order_by`, `select_related`, `prefetch_related`, pagination, and safe allowlists for user-controlled filtering and sorting.
