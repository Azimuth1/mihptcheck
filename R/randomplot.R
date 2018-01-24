#' Make a random plot
#' 
#' This function creates a random histogram plot.
#' 
#' @export
#' @param n numer of random values 
#' @param dist one of "normal" or "uniform".
randomplot <- function(water_level, dist=c("normal", "uniform")){
  #input validation
  dist <- match.arg(dist)
#   stopifnot(n < 1e6)
  hist(rnorm(water_level))
  #return nothing
  invisible();  
}