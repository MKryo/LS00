import gspread
from oauth2client.service_account import ServiceAccountCredentials
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.http import HttpResponseServerError
from make_html import make_html
from . import gspread_auth


@csrf_exempt
def send(request):
    try:
        scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
        credentials = ServiceAccountCredentials.from_json_keyfile_name(gspread_auth.jsonkey_path, scope)
        gc = gspread.authorize(credentials)
        worksheet = gc.open_by_url(gspread_auth.gspread_url).worksheet("symmetry")

        data = dict(request.POST.lists())
        worksheet.append_row(data['data[]'])



    except Exception as e:
        import traceback
        traceback.print_exc()
        return HttpResponseServerError()
    return HttpResponse(make_html("Succeed!"))


if __name__ == "__main__":
    send({}, True)
