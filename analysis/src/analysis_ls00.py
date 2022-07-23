from re import A
from sys import api_version
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from scipy.stats import pearsonr

class analysis:

    def corr(data_select):
        df_original = pd.read_csv('../data/model-to-data/original.csv')

        if data_select==1:
            # LS00オリジナルの実験データに対する各因果帰納モデルの相関係数・決定係数
            dfh_corr=df_original['mean'].corr(df_original['DFH'])
            paris_corr=df_original['mean'].corr(df_original['pARIs'])
            deltap_corr=df_original['mean'].corr(df_original['ΔP'])
            original_corr = np.array([dfh_corr,paris_corr,deltap_corr])
            print("オリジナル実験 DFH, pARIs, ΔP")
            print("相関係数",original_corr)
            print("決定係数",original_corr**2)
        
        elif data_select==2:
            df_Faithful = pd.read_csv('../data/model-to-data/Faithful.csv')
            # LS00忠実再現実験データに対する各因果帰納モデルの相関係数・決定係数
            dfh_corr=df_Faithful['mean'].corr(df_Faithful['DFH'])
            paris_corr=df_Faithful['mean'].corr(df_Faithful['pARIs'])
            deltap_corr=df_Faithful['mean'].corr(df_Faithful['ΔP'])
            original_corr = np.array([dfh_corr,paris_corr,deltap_corr])
            print("忠実実験 DFH, pARIs, ΔP")
            print("相関係数",original_corr)
            print("決定係数",original_corr**2)
        
        elif data_select==3:
            df_Change = pd.read_csv('../data/model-to-data/Change.csv')
            # LS00変更実験データに対する各因果帰納モデルの相関係数・決定係数
            dfh_corr=df_Change['mean'].corr(df_Change['DFH'])
            paris_corr=df_Change['mean'].corr(df_Change['pARIs'])
            deltap_corr=df_Change['mean'].corr(df_Change['ΔP'])
            original_corr = np.array([dfh_corr,paris_corr,deltap_corr])
            print("変更実験 DFH, pARIs, ΔP")
            print("相関係数",original_corr)
            print("決定係数",original_corr**2)
        

    def stat(data_select):
        if data_select==1:
            df_est = pd.read_csv('../data/exp123_data/res_estimations_exp1.csv')
        elif data_select==2:
            df_est = pd.read_csv('../data/exp123_data/res_estimations_exp2.csv')
        elif data_select==3:
            df_est = pd.read_csv('../data/exp123_data/res_estimations_exp3.csv')

        df_est_freq1 = df_est[df_est['frequency'] == 1]
        df_est_freq2 = df_est[df_est['frequency'] == 2]
        df_est_freq3 = df_est[df_est['frequency'] == 3]
        df_est_freq4 = df_est[df_est['frequency'] == 4]

        est_mean = []
        est_std = []

        # 刺激1
        est_mean.append(df_est_freq1['estimation'].mean())
        # 刺激2
        est_mean.append(df_est_freq2['estimation'].mean())
        # 刺激3
        est_mean.append(df_est_freq3['estimation'].mean())
        # 刺激4
        est_mean.append(df_est_freq4['estimation'].mean())

        # 刺激1
        est_std.append(df_est_freq1['estimation'].std())
        # 刺激2
        est_std.append(df_est_freq2['estimation'].std())
        # 刺激3
        est_std.append(df_est_freq3['estimation'].std())
        # 刺激4
        est_std.append(df_est_freq4['estimation'].std())

        print("mean", est_mean)
        print("std", est_std)
    

    def plot(data_select):

        df_original = pd.read_csv('../data/model-to-data/original.csv')
        df_Faithful = pd.read_csv('../data/model-to-data/Faithful.csv')
        df_Change = pd.read_csv('../data/model-to-data/Change.csv')

        if data_select==1:
            # LS00オリジナルの実験データ
            mean = df_original['mean'].values
            dfh = df_original['DFH'].values * 100
            paris = df_original['pARIs'].values * 100
            deltap = df_original['ΔP'].values * 100
        elif data_select==2:
            mean = df_Faithful['mean'].values
            dfh = df_Faithful['DFH'].values * 100
            paris = df_Faithful['pARIs'].values * 100
            deltap = df_Faithful['ΔP'].values * 100
        elif data_select==3:
            mean = df_Change['mean'].values
            dfh = df_Change['DFH'].values * 100
            paris = df_Change['pARIs'].values * 100
            deltap = df_Change['ΔP'].values * 100



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


    def testofnocorr():

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
        # print('(相関係数, p値):', p_values)
        for i in range(len(p_values)):
            print(p_values[i][1])


        # LS00忠実再現実験データ
        # 無相関検定
        mean = df_Faithful['mean'].values
        dfh = df_Faithful['DFH'].values
        paris = df_Faithful['pARIs'].values
        deltap = df_Faithful['ΔP'].values
        #ピアソンの相関係数とp値を計算
        p_values = [pearsonr(mean, dfh), pearsonr(mean, paris), pearsonr(mean, deltap)]
        # print('(相関係数, p値):', p_values)
        for i in range(len(p_values)):
            print(p_values[i][1])


        # LS00変更実験データ
        # 無相関検定
        mean = df_Change['mean'].values
        dfh = df_Change['DFH'].values
        paris = df_Change['pARIs'].values
        deltap = df_Change['ΔP'].values
        #ピアソンの相関係数とp値を計算
        p_values = [pearsonr(mean, dfh), pearsonr(mean, paris), pearsonr(mean, deltap)]
        # print('(相関係数, p値):', p_values)
        for i in range(len(p_values)):
            print(p_values[i][1])


analysis.plot(3)
print(analysis.corr(1))
print(analysis.stat(2))
print(analysis.testofnocorr())
