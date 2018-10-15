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
import org.moqui.impl.context.ExecutionContextImpl
import org.moqui.entity.EntityCondition
import org.moqui.entity.EntityFind
import org.moqui.entity.EntityList
import org.moqui.entity.EntityValue
import org.moqui.util.StringUtilities


// org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger("findParty")

ExecutionContextImpl ec = context.ec

// generate login key
String _loginKey = StringUtilities.getRandomString(40)

// save hashed in UserLoginKey, calc expire and set from/thru dates
String hashedKey = ec.ecfi.getSimpleHash(_loginKey, "", ec.ecfi.getLoginKeyHashType(), false)
int expireHours = ec.ecfi.getLoginKeyExpireHours()
Timestamp fromDate = new Timestamp(System.currentTimeMillis())
long thruTime = fromDate.getTime() + (expireHours * 60*60*1000)
ec.serviceFacade.sync().name("create", "moqui.security.UserLoginKey")
		.parameters([loginKey:hashedKey, userId:"EX_JOHN_DOE", fromDate:fromDate, thruDate:new Timestamp(thruTime)])
		.disableAuthz().requireNewTransaction(true).call()

// clean out expired keys
ec.entity.find("moqui.security.UserLoginKey").condition("userId", userId)
		.condition("thruDate", EntityCondition.LESS_THAN, fromDate).disableAuthz().deleteAll()
loginKey= _loginKey