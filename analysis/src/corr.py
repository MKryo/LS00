from re import A
from sys import api_version
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

df_original = pd.read_csv('../data/model-to-data/original.csv')
df_Faithful = pd.read_csv('../data/model-to-data/Faithful.csv')
df_Change = pd.read_csv('../data/model-to-data/Change.csv')

# LS00オリジナルの実験データに対する各因果帰納モデルの相関係数・決定係数
dfh_corr=df_original['mean'].corr(df_original['DFH'])
paris_corr=df_original['mean'].corr(df_original['pARIs'])
deltap_corr=df_original['mean'].corr(df_original['ΔP'])
original_corr = np.array([dfh_corr,paris_corr,deltap_corr])
print("オリジナル実験 DFH, pARIs, ΔP")
print("相関係数",original_corr)
print("決定係数",original_corr**2)

# LS00忠実再現実験データに対する各因果帰納モデルの相関係数・決定係数
dfh_corr=df_Faithful['mean'].corr(df_Faithful['DFH'])
paris_corr=df_Faithful['mean'].corr(df_Faithful['pARIs'])
deltap_corr=df_Faithful['mean'].corr(df_Faithful['ΔP'])
original_corr = np.array([dfh_corr,paris_corr,deltap_corr])
print("忠実実験 DFH, pARIs, ΔP")
print("相関係数",original_corr)
print("決定係数",original_corr**2)

# LS00変更実験データに対する各因果帰納モデルの相関係数・決定係数
dfh_corr=df_Change['mean'].corr(df_Change['DFH'])
paris_corr=df_Change['mean'].corr(df_Change['pARIs'])
deltap_corr=df_Change['mean'].corr(df_Change['ΔP'])
original_corr = np.array([dfh_corr,paris_corr,deltap_corr])
print("変更実験 DFH, pARIs, ΔP")
print("相関係数",original_corr)
print("決定係数",original_corr**2)
