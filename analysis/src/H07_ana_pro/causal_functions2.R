# models
CP   <- function(a,b,c,d) { a / (a+b) }
CPc  <- function(a,b,c,d) { CP(a,c,b,d) }
DP   <- function(a,b,c,d) { Pqp <- a/(a+b); Ptqfp <- c/(c+d); (Pqp - Ptqfp) }
DPc  <- function(a,b,c,d) { DP(a,c,b,d) }
DH   <- function(a,b,c,d) { Pqp <- a/(a+b); Ppq <- a/(a+c); sqrt( Pqp * Ppq ) }
LS   <- function(a,b,c,d) { (a+b/(b+d)*d) / (a+b+a/(a+c)*c+b/(b+d)*d) }
LSm  <- function(a,b,c,d) { (a + b/(b+d)*d - b - a/(a+c)*c) / (a+b+a/(a+c)*c+b/(b+d)*d) }
LSc  <- function(a,b,c,d) { LS(a,c,b,d) }
RS  <- function(a,b,c,d) { (a+d)/(a+b+c+d) }
MS10 <- function(a,b,c,d) { a/(a+b+c) }
MS1005 <- function(a,b,c,d) { a/(a+(b+c)/2) }
pARIs <- function(a,b,c,d) { a/(a+b+c) }
HS <- function(a,b,c,d) { a/(a+(b+c)/2) }
pCI <- function(a,b,c,d) { (a+d-b-c)/(a+b+c+d) }
LSR <- function(a,b,c,d) { (a+b)/(a+b+b+a*c/(a+c)) }
KPP <- function(a,b,c,d) { (2*(a * d - b * c)) / ( (a + b)*(b + d) + (a + c)*(c + d) )}
yon <- function(a,b,c,d) { (a*d - c*b) / sqrt((a+b)*(c+d)*(a+c)*(b+d)) }

PW <- function(a,b,c,d) {(a*d-b*c)/((a+b)*d)}
PN <- function(a,b,c,d) {(a*d-b*c)/((c+d)*a)}
R <- function(a,b,c,d) {((a+d) - (b+c)) / (a+b+c+d)}
PT <- function(a,b,c,d) {a*(2*a+b+c)/(2*(a+b)*(a+c))}
Q <- function(a,b,c,d) { (a*d-b*c)/(a*d + b*c)  }
Y <- function(a,b,c,d) { (sqrt(a*d) - sqrt(b*c))/(sqrt(a*d)+sqrt(b*c)) }
SK <- function(a,b,c,d) {4*(a*d-b*c)/((a+b+c+d)^2)}
G <- function(a,b,c,d) {(a*d-b*c)/(d*(a+b)+b*(c+d)) }
S <- function(a,b,c,d) {a/(a+b) - (a+c)/(a+b+c+d)}												  
## DH for preventive causes?
## DHp <- function(a,b,c,d) { DH(a,b,c,d) - DH(c,d,a,b) }
models  <- c( CP,   CPc,   DP,   DPc,  DH,   LS,   LSc,  RS,   MS10,  MS1005,  pCI,   LSR)##,   DHp )
modelsS <- c("CP", "CPc", "DP", "DPc","DH", "LS", "LSc","RS", "MS10","MS1005","pCI", "LSR")##, "DHp" )
LSB1   <- function(a,b,c,d) { (a+a/(a+b)*b) / (a+b+a/(a+b)*b+c/(c+d)*d) }
LSB2   <- function(a,b,c,d) { (a+c/(c+d)*d) / (a+b+a/(a+b)*b+c/(c+d)*d) }
##DP <- function(a,b,c,d){((a*d-b*c) / ((a+b) *(c+d)) + 1)/2}

SHF_DP <- function (a,b,c,d){
	data <- DP(a,b,c,d)
	x_max <- 1
	x_min <- -1

	y_max <- 1
	y_min <- 0
	(y_max - y_min) / (x_max - x_min) * (data - x_min) + y_min
}

SHF_YON <- function (a,b,c,d){
	data <- yon(a,b,c,d)
	x_max <- 1
	x_min <- -1

	y_max <- 1
	y_min <- 0
	(y_max - y_min) / (x_max - x_min) * (data - x_min) + y_min
}


