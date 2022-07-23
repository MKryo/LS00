from analysis_ls00 import analysis

'''
Parameters
data_select
1: オリジナルの実験データ
2: 忠実再現した追試の実験データ
3: 変更再現した追試の実験データ
（stat, plot, corr のみ）
-------------------
Returns
stat: 人間の回答値（実験データ）の基本統計量
plot: 縦軸:人間の回答  横軸:モデルの評価値  プロットと回帰直線
corr: 人間の回答とモデルの評価値との相関係数、決定係数
testofnocorr: 人間の回答とモデルの評価値との相関係数に対する無相関検定をしたときのP値
-------------------
'''


analysis.plot(data_select=1)
print(analysis.corr(data_select=1))
print(analysis.stat(data_select=1))
print(analysis.testofnocorr())
