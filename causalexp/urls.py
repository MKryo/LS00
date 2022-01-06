"""causalexp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls import include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    url(r'^top1/', include('top1.urls')),
    url(r'^top1_ls00/', include('top1_ls00.urls')),
    url(r'^examine1/', include('examine1.urls')),
    url(r'^examine1_ls00/', include('examine1_ls00.urls')),
    url(r'^top2/', include('top2.urls')),
    url(r'^top2_ls00/', include('top2_ls00.urls')),
    url(r'^examine2/', include('examine2.urls')),
    url(r'^examine2_ls00/', include('examine2_ls00.urls')),
    url(r'^top3/', include('top3.urls')),
    url(r'^top3_ls00/', include('top3_ls00.urls')),
    url(r'^examine3/', include('examine3.urls')),
    url(r'^examine3_ls00/', include('examine3_ls00.urls')),
    url(r'^end/', include('end.urls')),
    url(r'^sendtoGS/', include('sendtoGS.urls')),
    url(r'^admin/', admin.site.urls),
]

urlpatterns += staticfiles_urlpatterns()