# coding: utf-8


def make_html(data: str):
    """ make html page from strings """
    f = open("./templates/header.html")
    header = f.read()
    f.close()
    f = open("./templates/footer.html")
    footer = f.read()
    f.close()
    return header + data + footer
