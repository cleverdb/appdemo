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

// org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger("findParty")

ExecutionContext ec = context.ec

// NOTE: doing a find with a static view-entity because the Entity Facade will only select the fields specified and the
//     join in the associated member-entities
EntityFind ef = ec.entity.find("com.liou.UserAccountAndPerson").distinct(true)
// don't do distinct, SQL quandary with distinct, limited select, and order by with upper needing to be selected; seems to get good results in general without: .distinct(true)

if (post) { ef.condition("post", post) }
if (partyTypeEnumId) { ef.condition("partyTypeEnumId", partyTypeEnumId) }
if (department) { ef.condition("department", department) }
if (username) { ef.condition(ec.entity.conditionFactory.makeCondition("username", EntityCondition.LIKE,  (leadingWildcard ? "%" : "") + username + "%").ignoreCase()) }
if (userFullName) { ef.condition(ec.entity.conditionFactory.makeCondition("userFullName", EntityCondition.LIKE,  (leadingWildcard ? "%" : "") + userFullName + "%").ignoreCase()) }

if (roleTypeIds) {ef.condition(ec.entity.conditionFactory.makeCondition("partyId", EntityCondition.IN, getPartyIdsSet(roleTypeIds))) } 
	 Set<String> getPartyIdsSet(List roleTypeIds) {
		 Set<String> partyIds = new HashSet()
			 EntityList partyRolesList = ec.entity.find("mantle.party.PartyRole").condition(ec.entity.conditionFactory.makeCondition("roleTypeId", EntityCondition.IN, roleTypeIds))
					 .useCache(false).list()
			 for (EntityValue partyRole in partyRolesList) partyIds.add((String)partyRole.partyId)
		 return partyIds
	 }

if (!orderByField) {
        ef.orderBy("+username")
    } else {	
        ef.orderBy(orderByField)
    }

if (!pageNoLimit) { ef.offset(pageIndex as int, pageSize as int); ef.limit(pageSize as int) }

userAccountList = ef.list()

//for (EntityValue userAccount in userAccountList){
//	roleIds = []
//	EntityList partyRolesList = ec.entity.find("com.liou.PartyRoleTypes").condition(ec.entity.conditionFactory.makeCondition("roleTypeId", EntityCondition.IN, emplyeeType)).list()
//	for(EntityValue partyRole in partyRolesList){
//		roleIds.add(partyRole.roleTypeId);
//	}
//	userAccount.put("roleIds", roleIds);
//
//}

userAccountListCount = ef.count()
userAccountListPageIndex = ef.pageIndex
userAccountListPageSize = ef.pageSize
userAccountListPageMaxIndex = ((BigDecimal) (userAccountListCount - 1)).divide(userAccountListPageSize, 0, BigDecimal.ROUND_DOWN) as int
userAccountListPageRangeLow = userAccountListPageIndex * userAccountListPageSize + 1
userAccountListPageRangeHigh = (userAccountListPageIndex * userAccountListPageSize) + userAccountListPageSize
if (userAccountListPageRangeHigh > userAccountListCount) userAccountAndPersonListPageRangeHigh = userAccountListCount
