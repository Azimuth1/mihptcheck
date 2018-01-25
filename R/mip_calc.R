mip_calc <- function(mipfile, water_level, ...){

    if(substring(tolower(mipfile), nchar(mipfile)-3) != ".zip"){
      stop('Uploaded data needs to be a .zip file. ');
    }

    options(stringsAsFactors = FALSE)

    mhp_filename <- paste0(substr(basename(mipfile),0,nchar(basename(mipfile))-8),".mhp")
    data <- read.table(unz(mipfile, mhp_filename), header=T, quote="\"", sep="\t", na.strings = "n/a", row.names=NULL)

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

    waterlevels<-NULL
    water_level <- as.numeric(water_level)

    chop<-function(x,d){
      tail(head(x,-d),-d)
    }

    chopmiddle<-function(x,d){
      tail(head(x,length(x)/2),length(x)*0.4)
    }
    #d<-as.numeric(chopmiddle(data[,"Depth (ft)"],20))
    #p<-chopmiddle(data[,"HPT Press. Avg (psi)"],20)
    d<-as.numeric(data[,"Depth (ft)"])
    p<-as.numeric(data[,"HPT Press. Avg (psi)"])
    p_grad <- 0.44

    plot(d,p,
         type='l',
         col='black',
         xlab="Depth (ft)",
         ylab="Pressure (PSI)",
         ylim=c(0,40)
         )
    #abline(min(p),0,col="green")
    grid()

    p_c<-p
    belowwater<-which(d>water_level)
    p_c[belowwater]<-p[belowwater]-((d[belowwater]-water_level)*p_grad)

    EstK<-0.00745*log10(data[,"HPT Flow Avg (mL/min)"]/p_c)  #cm/sec

    mip_file_data<-cbind(data,p_c,EstK)

    return(mip_file_data)

}
