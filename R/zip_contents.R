zip_contents <- function(mipfile, ...){
  fns <- unzip(mipfile, junkpaths = TRUE, exdir = tempdir())
  return (fns)
}
