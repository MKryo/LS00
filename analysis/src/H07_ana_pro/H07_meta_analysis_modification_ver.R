######### 各種読み込み  #########
##### 大元のディレクトリ
setwd("~/Dropbox/pARIS/meta_analysis_2017/H07")
##### 因果帰納のモデル
source("H07_ana_pro/causal_functions2.R")
source("H07_ana_pro/SHF.R") # 線形変換の関数
source("H07_ana_pro/fisher_function.R") # フィッシャーのz変換に用いる関数
ex_names <- list.files(path = "raw_data",full.names=FALSE) ##各実験のデータが保存されているファイル名取得

# AS95 を抜く
ex_names <- ex_names[-1]
cat("Experiment names are \n", ex_names)
cat("The number of Experiment is", length(ex_names))
######### 各種必要な変数 #########
# 計算の誤差：有効桁数は何桁か？
gosa <- 10

##計算するモデル for文の中に追加する
names_models <- c("LS","pARIs","DP","YON","DFH")

##相関の入れ物
cor_data <- 0

###モデルの評価値と人間の評価値の全体データ．誤差計算用
all_data <- 1:12

###z変換に必要なデータ数保存
all_number_of_data <- -1

######### 実験データの読み込み #########
for(a_ex_name in ex_names){
	###データの読み込み
	data1 <- as.matrix(read.csv(paste("raw_data/",a_ex_name,sep="")))
	###列名の収得
	names_pior <- colnames(data1)
	###BCC03exp3のみ線形変換
	if(a_ex_name == "BCC03exp3.csv"){
		data1[,"rating"] <-SHF(data1[,"rating"])
		}
	###モデルの評価値の計算
	data1 <- cbind(
		data1,
		round(LS(data1[,"a"],data1[,"b"],data1[,"c"],data1[,"d"]),gosa),
		round(pARIs(data1[,"a"],data1[,"b"],data1[,"c"],data1[,"d"]),gosa),
		round(SHF_DP(data1[,"a"],data1[,"b"],data1[,"c"],data1[,"d"]),gosa),
		round(SHF_YON(data1[,"a"],data1[,"b"],data1[,"c"],data1[,"d"]),gosa),
		round(DH(data1[,"a"],data1[,"b"],data1[,"c"],data1[,"d"]),gosa)
	)
	###モデル名の付与
	colnames(data1) <- c(names_pior, names_models)
	
	###データ数のカウント
	all_number_of_data <- rbind(all_number_of_data,dim(data1)[1])
	
	##モデルの評価値が出力される
	write.csv(data1,paste("cal/",a_ex_name,sep=""))

	##モデルと人間の評価値の相関
	cor_data <- rbind(cor_data, cor(data1[,"rating"],data1[, names_models]))
	
	##モデルと人間の評価値の誤差の前処理
	print(a_ex_name)
	print(dim(data1))
	all_data <- rbind(all_data, data1)
	
}
######### 整形 #########
all_data <- all_data[-1,] #余分な抜かす
### 実験データが全て入っているデータを用意する EI 分析のために
write.csv(x = all_data[,1:7] , file = "all_raw_data_for_EI.csv",row.names = FALSE)
### check用
write.csv(x = all_data , file = "all_raw_data.csv",row.names = FALSE)
###人間とモデルの相関の整形
cor_data <- round(cor_data[-1,],gosa)
rownames(cor_data) <- ex_names
######### 相関  #########
write.csv(cor_data,"cal_cor/cor_data.csv",col.names = FALSE, append=TRUE)
##決定係数
cor_data_2 <- round(cor_data^2,gosa)
write.csv(cor_data_2,"cal_cor/cor^2_data.csv",col.names = FALSE, append=TRUE)

### RMSの計算 #########
tmp <- all_data[,"rating"] - all_data[,names_models]*100
tmp <- tmp^2
tmp <- colMeans(tmp)
tmp <- sqrt(tmp)
#rownames(tmp) <- names_models
write.csv(tmp,"cal_cor/rms_data.csv",col.names = FALSE, append=TRUE)

######### フィッシャーのz変換  #########
all_number_of_data <- all_number_of_data[-1]

all_number_of_data <- all_number_of_data - 3
#cor_data[8,3] <- 0
#cor_data[8,4] <- 0
#all_number_of_data[7:8] <- 0
fisher.cor <- fisher(cor_data_2[,]) * (all_number_of_data)
fisher.cor.sum <- colSums(fisher.cor) / sum(all_number_of_data)
print(round(inv_fisher(fisher.cor.sum),gosa))
result1 <- round(inv_fisher(fisher.cor.sum),gosa)

fisher.cor <- fisher(cor_data_2[-8,]) * (all_number_of_data[-8] )
fisher.cor.sum <- colSums(fisher.cor) / sum(all_number_of_data)

print(round(inv_fisher(fisher.cor.sum),gosa))
result2 <- round(inv_fisher(fisher.cor.sum),gosa)


result<-c(result1[c("LS","pARIs")], result2[c("DP","YON")],result1[c("DFH")])

write.csv(result,"cal_cor/cor_z_data.csv",col.names = FALSE, append=TRUE)

####### データの整形 #########

data.cor2.z.rms <- data.frame(t(cor_data_2),fisher_s_z = result,RMS = tmp)
#data.cor2.z.rms <- data.cor2.z.rms[,c(1,2,3,6,7,8,5,4,9,10)]
data.cor2.z.rms <- data.cor2.z.rms[c("DFH","DP","YON","pARIs"),]
data.cor2.z.rms <- round(data.cor2.z.rms,3)
write.csv(x = data.cor2.z.rms, file= "cal_cor/data.cor2.z.rms.csv",row.names = TRUE)
