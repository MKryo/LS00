SHF <- function (data){
  x_max <- 100
  x_min <- -100
  
  y_max <- 100
  y_min <- 0
  (y_max - y_min) / (x_max - x_min) * (data - x_min) + y_min
}