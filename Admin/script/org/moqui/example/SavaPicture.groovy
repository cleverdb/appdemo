/*
 * This software is in the public domain under CC0 1.0 Universal plus a 
 * Grant of Patent License.
 * 
 * To the extent possible under law, the author(s) have dedicated all
 * copyright and related and neighboring rights to this software to the
 * public domain worldwide. This software is distributed without any
 * warranty.
 * 
 * You should have received a copy of the CC0 Public Domain Dedication
 * along with this software (see the LICENSE.md file). If not, see
 * <http://creativecommons.org/publicdomain/zero/1.0/>.
 */

import java.util.Set
import org.moqui.context.ExecutionContext
import org.moqui.entity.EntityCondition
import org.moqui.entity.EntityFind
import org.moqui.entity.EntityList
import org.moqui.entity.EntityValue
import javax.imageio.ImageIO;
import java.awt.image.RenderedImage;
import org.moqui.resource.ResourceReference;


ExecutionContext ec = context.ec

try{
	
	InputStream fileStream = uploadFile.getInputStream()
	String realFileName = uploadFile.name
	String suffix = realFileName.substring(realFileName.lastIndexOf(".")+1)
	String fileName = fileNamePerfix+"."+suffix
	ResourceReference docRr =  ec.resource.getLocationReference(savePath)
	String filePath = docRr.url.path+File.separator+fileName
	ImageIO.write(ImageIO.read(fileStream),suffix , new File(filePath))
	context.fileName = fileName
}catch(Exception e){
	e.printStackTrace()
	ec.message.addError(e.message)
}