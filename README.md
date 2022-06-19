# causal induction cognitive experiment 

## explanation 
- This is an experiment to reproduce (Lobor & Shanks 2000).
- Lobor & Shanks 2000 https://pubmed.ncbi.nlm.nih.gov/10687407/

## setup
on the root-directory

```
python3 -m venv ls00
```

```
source ls00/bin/activate
```

```
pip install Django==2.1
```

```
pip install numpy
```

```
pip install pandas
```

```
pip install matplotlib
```

```
pip install seaborn
```


## run
```
python manage.py collectstatic
```

```
python manage.py runserver
```
