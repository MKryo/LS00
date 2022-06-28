from re import A
from sys import api_version
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import pearsonr

'''
scipy.stats.pearsonr
-------------------
Pearson correlation coefficient and p-value for testing non-correlation.
-------------------
Parameters
x(N,) array_like
Input array.

y(N,) array_like
Input array.
-------------------
Returns
rfloat
Pearson's correlation coefficient.

p-valuefloat
Two-tailed p-value.
-------------------
https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.pearsonr.html
'''

df_original = pd.read_csv('../data/model-to-data/original.csv')
df_Faithful = pd.read_csv('../data/model-to-data/Faithful.csv')
df_Change = pd.read_csv('../data/model-to-data/Change.csv')

# LS00オリジナルの実験データ
# 無相関検定
mean = df_original['mean'].values
dfh = df_original['DFH'].values
paris = df_original['pARIs'].values
deltap = df_original['ΔP'].values
#ピアソンの相関係数とp値を計算
p_values = [pearsonr(mean, dfh), pearsonr(mean, paris), pearsonr(mean, deltap)]
print('(相関係数, p値):', p_values)

# LS00忠実再現実験データ
# 無相関検定
mean = df_Faithful['mean'].values
dfh = df_Faithful['DFH'].values
paris = df_Faithful['pARIs'].values
deltap = df_Faithful['ΔP'].values
#ピアソンの相関係数とp値を計算
p_values = [pearsonr(mean, dfh), pearsonr(mean, paris), pearsonr(mean, deltap)]
print('(相関係数, p値):', p_values)

# LS00変更実験データ
# 無相関検定
mean = df_Change['mean'].values
dfh = df_Change['DFH'].values
paris = df_Change['pARIs'].values
deltap = df_Change['ΔP'].values
#ピアソンの相関係数とp値を計算
p_values = [pearsonr(mean, dfh), pearsonr(mean, paris), pearsonr(mean, deltap)]
print('(相関係数, p値):', p_values)


#### 結果 #####
# 全ての相関係数において p値が0.05より小さいので無相関検定において統計的に有意
# 無相関であるとは言えないということが示せた。