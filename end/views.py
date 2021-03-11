from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render
# Create your views here.


def index(request):
    if "id" in request.GET:
        return render(request,'end.html')

    else:
        # query_paramが指定されていない場合の処理
        return HttpResponse("Oops!This is invalid page.")