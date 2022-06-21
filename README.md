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


# data
## Files
- res_user_data_exp*.csv
- res_predictions_exp*.csv
- res_estimations_exp*.csv

## Columns
### user_data
- user_id
- start_time
- end_time
- user_agent

### predictions
- user_id
- animal
- frequency
- pred_i
- stimulation
- cause
- effect
- prediction

### estimation
- user_id
- animal
- frequency
- est_i
- estimation 因果関係の強さの推定値
