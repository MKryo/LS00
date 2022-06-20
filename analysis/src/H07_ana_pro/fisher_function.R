fisher <- function(r){
  0.5*log((1+r)/(1-r))
}
inv_fisher <- function(z){
  (exp(2*z)-1)/(exp(2*z)+1)
}
