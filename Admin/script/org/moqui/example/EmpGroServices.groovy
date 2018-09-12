import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;
import org.moqui.impl.context.reference.BaseResourceReference;
import org.moqui.impl.context.reference.DbResourceReference;


try{
		docRr =  ec.resource.getLocationReference("component://example/screen/images/${uploadFile.name}")
		Nemp = ec.getEntity().makeValue("dongbo.Emp")
		InputStream fileStream = uploadFile.getInputStream()
		println("--------------------------------------"+fileStream.available())
        try {
         //docRr.putStream(fileStream)
//         byte[] data = new byte[fileStream.available()]
//         fileStream.read(data)
//		 BASE64Encoder encoder = new BASE64Encoder()
//         byte[] encodeBase64 = encoder.encode(data)
//		 image = new String(encodeBase64)
		 docRr.putStream(fileStream)
        } finally {
          fileStream.close()
        }
        emp.setAll(context)
		emp.setSequencedIdPrimary()
		//emp.icon = "data:image/png;base64,"+image
		emp.icon = docRr
		emp.create()
		emp.
		id = emp.id
	}catch(Exception e){
		e.printStackTrace()
		ec.logger.info("-------------------++++----------------------------" +e)
	}