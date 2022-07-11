from re import A
from sys import api_version
import csv
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

df_original = pd.read_csv('../data/model-to-data/original.csv')
df_Faithful = pd.read_csv('../data/model-to-data/Faithful.csv')
df_Change = pd.read_csv('../data/model-to-data/Change.csv')


# LS00オリジナルの実験データ
# 無相関検定
mean = df_original['mean'].values
dfh = df_original['DFH'].values * 100
paris = df_original['pARIs'].values * 100
deltap = df_original['ΔP'].values * 100

plt.scatter(dfh,mean)
plt.title("DFH plot")
plt.xlabel("DFH", fontsize=10)
plt.ylabel("mean", fontsize=10)
# plt.show()

plt.scatter(mean, paris)
plt.xlabel("DFH", fontsize=10)
plt.ylabel("paris", fontsize=10)
# plt.show()

plt.scatter(mean, deltap)
plt.xlabel("DFH", fontsize=10)
plt.ylabel("deltap", fontsize=10)
# plt.show()

mod = LinearRegression()
df_x = pd.DataFrame(dfh)
df_y = pd.DataFrame(mean)
mod_lin = mod.fit(df_x, df_y)
y_lin_fit = mod_lin.predict(df_x)
r2_lin = mod.score(df_x, df_y)
plt.plot(df_x, y_lin_fit, color = 'blue')

mod = LinearRegression()
df_x = pd.DataFrame(paris)
df_y = pd.DataFrame(mean)
mod_lin = mod.fit(df_x, df_y)
y_lin_fit = mod_lin.predict(df_x)
r2_lin = mod.score(df_x, df_y)
plt.plot(df_x, y_lin_fit, color = 'red')


mod = LinearRegression()
df_x = pd.DataFrame(deltap)
df_y = pd.DataFrame(mean)
mod_lin = mod.fit(df_x, df_y)
y_lin_fit = mod_lin.predict(df_x)
r2_lin = mod.score(df_x, df_y)
plt.plot(df_x, y_lin_fit, color = 'green')

plt.show()