# %%
from scipy.stats import chi2
import os
import numpy as np
import pandas as pd
import models
import math
import importlib
importlib.reload(models)

# %%
exp_data_dir = '../../data/raw_data'
experiment_filenames = os.listdir(exp_data_dir)
experiment_filenames.remove('AS95.csv')
# experiment_filenames.remove('PS04exp1a.csv')
exp_names = [fn.rstrip('.csv') for fn in experiment_filenames]
print(experiment_filenames)


def fisher_z(r):
    return 0.5 * math.log((1 + r) / (1 - r))


def linear_trans(data):
    bef_conv_max = 100
    bef_conv_min = -100
    aft_conv_max = 100
    aft_conv_min = 0
    return (aft_conv_max - aft_conv_min) / (bef_conv_max - bef_conv_min) * (data - bef_conv_min) + aft_conv_min


# %%
significant_figure = 10  # 有効数字
target_model_names = ['phi', 'paris', 'delatap', 'dfh', 'dr', 'Generalized_mean']  # TODO: 自動で名前のリストを作るようにする
latex_model_names = ['\phi', 'pARIs', '\delata P', 'DFH', 'DR', 'Generalized_mean']
target_models = [models.phi, models.paris, models.deltap, models.dfh, models.dr, models.Generalized_mean]
qty_stims = pd.Series([-1 for i in range(len(experiment_filenames))], name='qty_stims')  # 各実験の刺激数
corr_df = pd.DataFrame(columns=target_model_names)  # 各実験の相関係数
rms_df = pd.DataFrame(columns=target_model_names)

# for alpha in [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]:
#     for m in [-1.6, -1.5, -1.4, -1.3, -1.2, -1.1, -1.0, -0.9, -0.8, -0.7, -0.6, -0.5, -0.4, -0.3]:
        # 一般化平均モデルの相関係数が最大のポイントのalpha, m


for exp_i, exp_fn in enumerate(experiment_filenames):
    # 実験データの読み込み
    exp_df = pd.read_csv(os.path.join(exp_data_dir, str(exp_fn)))
    exp_df = exp_df.drop(exp_df.columns[0], axis=1)
    if (exp_fn == "BCC03exp3.csv"):
        exp_df['rating'] = linear_trans(exp_df['rating'])

    # モデルによる推定値の算出
    for stim_i in range(len(exp_df)):
        for model_i, model_v in enumerate(target_models):
            # 一般化平均モデル導入
            if model_i == len(target_models)-1:
                model_value = models.Generalized_mean(np.round(np.array(exp_df.loc[stim_i, 'a':'d']), significant_figure), 0.38, -1.3)
            else:
                model_value = model_v(np.round(np.array(exp_df.loc[stim_i, 'a':'d']), significant_figure))
            exp_df.loc[stim_i, target_model_names[model_i]] = model_value

    # 実験の刺激数を記憶
    qty_stims[exp_i] = len(exp_df)

    # 実験データと各モデル値の相関係数を算出
    corr_dict = {}
    rms_dict = {}
    for model_i, model_v in enumerate(target_models):
        corr_dict[target_model_names[model_i]] = (np.corrcoef(exp_df['rating'], exp_df[target_model_names[model_i]])[0, 1])**2
        rms_dict[target_model_names[model_i]] = math.sqrt(np.mean((exp_df['rating'] - exp_df[target_model_names[model_i]] * 100)**2))
    corr_df = corr_df.append(corr_dict, ignore_index=True)
    rms_df = rms_df.append(rms_dict, ignore_index=True)

# res_corr_df = pd.concat([corr_df, qty_stims], axis=1)  # 刺激数と相関係数を統合

z_df = corr_df.applymap(fisher_z)  # z値
w_ser = qty_stims - 3  # 重み
v_ser = 1 / w_ser  # 分散

tidy_df = pd.DataFrame(corr_df.stack(), columns=["corr"])  # モデルの名称を、列名でなく値として整形
tidy_df.loc[:, 'qty_stims'] = qty_stims.loc[tidy_df.index.get_level_values(0)].values  # 刺激数を統合
tidy_df.loc[:, 'z'] = pd.DataFrame(z_df.stack(), columns=["z"])
tidy_df.loc[:, 'v'] = v_ser.loc[tidy_df.index.get_level_values(0)].values
tidy_df.loc[:, 'w'] = w_ser.loc[tidy_df.index.get_level_values(0)].values
# rhoは、各研究に対応する母集団における相関係数rho_iの近似的な95%信頼区間の上下の限界値
tidy_df.loc[:, 'rho_L'] = np.tanh(tidy_df.loc[:, 'z'] - 1.96 * np.sqrt(tidy_df.loc[:, 'v']))
tidy_df.loc[:, 'rho_U'] = np.tanh(tidy_df.loc[:, 'z'] + 1.96 * np.sqrt(tidy_df.loc[:, 'v']))
tidy_df.loc[:, 'w*z'] = tidy_df.loc[:, 'w'] * tidy_df.loc[:, 'z']
# print(tidy_df)
print(tidy_df.unstack()['corr'].T.set_axis(exp_names, axis=1))
# print(tidy_df.unstack()['corr'].T.set_axis(exp_names, axis=1).to_latex())
# %%
# 以降、固定効果モデルによる統合

zeta_hat_dict = {}  # zetaは母集団相関係数rhoのZ変換値、あるいは、Z値（corrのZ変換後の値）の加重平均。その推定値。
for model_i, model_v in enumerate(target_models):
    zeta_hat_dict[target_model_names[model_i]] = np.sum(w_ser * z_df[target_model_names[model_i]]) / np.sum(w_ser)

zeta_hat_ser = pd.Series(zeta_hat_dict)
rho_ser = zeta_hat_ser.apply(math.tanh)  # Z変換の逆変換tanhによってrhoを算出
v_hat_zeta_hat = 1 / np.sum(w_ser)  # zeta_hatの分散
se_hat_zeta_hat = np.sqrt(v_hat_zeta_hat)

zeta_hat_df = pd.DataFrame.from_dict(zeta_hat_dict, orient="index", columns=['zeta_hat'])
zeta_hat_df.loc[:, "zeta_L"] = zeta_hat_df.loc[:, "zeta_hat"] - 1.96 * se_hat_zeta_hat
zeta_hat_df.loc[:, "zeta_U"] = zeta_hat_df.loc[:, "zeta_hat"] + 1.96 * se_hat_zeta_hat
zeta_hat_df.loc[:, 'rho_hat'] = np.tanh(zeta_hat_df.loc[:, 'zeta_hat'])
zeta_hat_df.loc[:, 'rho_L'] = np.tanh(zeta_hat_df.loc[:, 'zeta_L'])
zeta_hat_df.loc[:, 'rho_U'] = np.tanh(zeta_hat_df.loc[:, 'zeta_U'])
print(zeta_hat_df.loc[:, 'rho_hat':'rho_U'])
# print(zeta_hat_df.to_latex())
# %%

# %%
# 等質性の検討
q_dict = {}
for model_i, model_v in enumerate(target_model_names):
    q_dict[model_v] = ((w_ser * (z_df[model_v] - zeta_hat_ser[model_v])**2).dropna()).sum()
q_df = pd.DataFrame.from_dict(q_dict, orient="index", columns=['q'])

degfree = len(experiment_filenames) - 1
all(q_df.loc[:, 'q'] < chi2.ppf(q=0.95, df=degfree))  # カイ二乗分布のppfの上側5%の値を確認する．
# 上の行がTrueならば、相関係数が等質であるという帰無仮説は棄却されない。
# したがって，固定効果もでるとして結果を統合することは妥当．

q_df.loc[:, 'numer'] = q_df.loc[:, 'q'] - degfree
q_df.loc[:, 'denom'] = (tidy_df.loc[:, 'w']).groupby(level=1).sum() - (tidy_df.loc[:, 'w']**2).groupby(level=1).sum() / (tidy_df.loc[:, 'w']).groupby(level=1).sum()
q_df.loc[:, 'r_hat^2'] = q_df.loc[:, 'numer'] / q_df.loc[:, 'denom']
print(q_df.loc[:, ["q", "r_hat^2"]])
# print(q_df.to_latex())
# %%
result = pd.concat(
    [
        tidy_df.unstack()['corr'].T.set_axis(exp_names, axis=1),
        zeta_hat_df.loc[:, 'rho_hat':'rho_U']
    ],
    axis=1
)
print(result)

# print(
#     pd.concat(
#         [
#             tidy_df.unstack()['corr'].T.set_axis(exp_names, axis=1),
#             zeta_hat_df.loc[:, 'rho_hat':'rho_U']
#         ],
#         axis=1
#     ).to_latex()
# )

# %%
