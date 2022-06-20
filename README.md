# causal induction cognitive experiment 

## explanation 
- This is an experiment to reproduce (Lobor & Shanks 2000).
- Lobor & Shanks 2000 https://pubmed.ncbi.nlm.nih.gov/10687407/

## set up 

```
python3 -m venv ls00
```

```
source ls00/bin/activate
```

```
pip install Django==2.1
```

## set up Analysis Scripts

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


## run experiment
```
python manage.py collectstatic
```

```
python manage.py runserver
```

## run Analysis Scripts
```
python stat.py
```

```
python fixedeffectsmodel.py
```
