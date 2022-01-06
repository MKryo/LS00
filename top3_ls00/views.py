from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'top3_ls00.html')