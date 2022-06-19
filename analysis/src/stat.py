import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import math
import seaborn as sns
# from sklearn.linear_model import LinearRegression
# from sklearn.metrics import r2_score

df_est = pd.read_csv('../data/exp123_data/res_estimations_exp1.csv')
df_pred = pd.read_csv('../data/exp123_data/res_predictions_exp1.csv')

df_est_freq1 = df_est[df_est['frequency'] == 1]
df_est_freq2 = df_est[df_est['frequency'] == 2]
df_est_freq3 = df_est[df_est['frequency'] == 3]
df_est_freq4 = df_est[df_est['frequency'] == 4]

print(df_est_freq1)

# 刺激1
df_est_freq1['estimation'].mean()
# 刺激2
df_est_freq2['estimation'].mean()
# 刺激3
df_est_freq3['estimation'].mean()
# 刺激4
df_est_freq4['estimation'].mean()
# 刺激1
df_est_freq1['estimation'].std()
# 刺激2
df_est_freq2['estimation'].std()
# 刺激3
print(df_est_freq3['estimation'].std())
# 刺激4
print(df_est_freq4['estimation'].std())
