mip_data_plot <- function(mipfile, water_level, plotting){

  if(substring(tolower(mipfile), nchar(mipfile)-3) != ".zip"){
    stop('Uploaded data needs to be a .zip file. ');
  }

  options(stringsAsFactors = FALSE)

  mhp_filename <- paste0(substr(basename(mipfile),0,nchar(basename(mipfile))-8),".mhp")
  data <- read.table(unz(mipfile, mhp_filename), header=T, quote="\"", sep="\t", na.strings = "n/a", row.names=NULL)
  
  data<- fix_column_names(data)
  
  waterlevels<-NULL
  water_level <- as.numeric(water_level)

  #d<-as.numeric(chopmiddle(data[,"Depth (ft)"],20))
  #p<-chopmiddle(data[,"HPT Press. Avg (psi)"],20)
  d <- as.numeric(data[,"Depth (ft)"])
  p <- as.numeric(data[,"HPT Press. Avg (psi)"])
  p_grad <- 0.44
  p_c <- p
  belowwater <- which(d>water_level)
  p_c[belowwater] <- p[belowwater] - ((d[belowwater] - water_level) * p_grad)

  #intcpt<-as.numeric(water_level)
  #p_0<-(p-p_grad*d)
  #diff<-min(p)-min(p_0)

  #p_c<-p_0+diff
  #p_c[which(d*p_grad+intcpt < min(p))]<-p[which(d*p_grad+intcpt < min(p))]

  #wlevel<-(min(p)-intcpt)/p_grad
  #waterlevels<-rbind(waterlevels,wlevel)
  EstK <- 0.00745 * log10(data[,"HPT Flow Avg (mL/min)"] / p_c)  #cm/sec

  if(plotting==TRUE) {
  ###################
  # PLOT SET TO TRUE
  ###################

tryCatch({

  ggplot2::ggplot(data, aes(d)) + 
    geom_line(aes(y = p, colour = "HPT Pressure")) + 
    geom_line(aes(y = EstK, colour = "var1")) +
    scale_colour_manual(values=c("black", "orange")) +
    coord_flip()+
    scale_x_reverse()

    invisible();

}, error = function(e){

    plot(d, p,
      type='l',
      col='black',
      xlab="Depth (ft)",
      ylab="Pressure (PSI)",
      ylim=c(0,40)
    )
    #abline(min(p),0,col="green")
    grid()
    #abline(intcpt,p_grad,col="blue")
    
    lines(d, p_c, col="red")

    legend("topleft",
      col = c("red", "black", "blue", "green", "orange"),
      lty = 1,
      legend = c(
        "Corrected Pressure",
        "HPT Pressure",
        "Hydrostatic Press.", 
        "Baseline Pressure", 
        "Est K."
      )
    )

    #points(wlevel,min(p),pch=19,bg="blue",col="darkblue")
    #text(wlevel,min(p),paste("waterlevel = ",wlevel),adj=c(0,1),col="blue",cex=0.75)

    par(new = TRUE)

    plot(d, EstK, 
      axes = F, 
      type = "l", 
      col = "orange", 
      xlab = "", 
      ylab = ""
    )
    axis(4)
    mtext("EstK (cm/sec)", 
      side = 4,
      line = -1.5
    )
    invisible();

})

  }else{
  ###################
  # PLOT SET TO FALSE
  ###################

    mip_file_data<-cbind(data,p_c,EstK)

    return(mip_file_data)
  }
}

fix_column_names <- function(data) {
    col_names <- c( "Depth (ft)",
                    "EC (mS/m)",
                    "ROP (ft/min)",
                    "Temp. Min (deg C)",
                    "Temp. Max (deg C)",
                    "MIP Pressure (psi)",
                    "MIP Flow (mL/min)",
                    "Depth (m)",
                    "ROP (m/min)",
                    "MIP Pressure (kPa)",
                    "Detector 1 Min (uV)",
                    "Detector 1 Max (uV)",
                    "Detector 2 Min (uV)",
                    "Detector 2 Max (uV)",
                    "Detector 3 Min (uV)",
                    "Detector 3 Max (uV)",
                    "Detector 4 Min (uV)",
                    "Detector 4 Max (uV)",
                    "HPT Press. Min (psi)",
                    "HPT Press. Avg (psi)",
                    "HPT Press. Max (psi)",
                    "HPT Flow Min (mL/min)",
                    "HPT Flow Avg (mL/min)",
                    "HPT Flow Max (mL/min)",
                    "HPT Line Press. Min (psi)",
                    "HPT Line Press. Avg (psi)",
                    "HPT Line Press. Max (psi)",
                    "HPT Press. Min (kPa)",
                    "HPT Press. Avg (kPa)",
                    "HPT Press. Max (kPa)",
                    "HPT Line Press. Min (kPa)",
                    "HPT Line Press. Avg (kPa)",
                    "HPT Line Press. Max (kPa)",
                    "HPT Screen Depth (ft)")

    colnames(data) <- col_names
    return (data)
}

# from Jason
chop<-function(x,d){
  tail(head(x,-d),-d)
}

# from Jason
chopmiddle<-function(x,d){
  tail(head(x,length(x)/2),length(x)*0.4)
}