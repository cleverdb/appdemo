1.
INSERT INTO "public"."artifact_group" ("artifact_group_id", "description", "last_updated_stamp") VALUES ('ADMIN_APP', 'admin to user', '2018-09-10 22:41:54');
2.
INSERT INTO "public"."artifact_group_member" ("artifact_group_id", "artifact_name", "artifact_type_enum_id", "name_is_pattern", "inherit_authz", "filter_map", "last_updated_stamp") VALUES ('ADMIN_APP', 'component://Admin/screen/AdminApp.xml', 'AT_XML_SCREEN', ' ', 'Y', '', '2018-09-10 07:20:02.279');
3. 
INSERT INTO "public"."artifact_authz" ("artifact_authz_id", "user_group_id", "artifact_group_id", "authz_type_enum_id", "authz_action_enum_id", "authz_service_name", "last_updated_stamp") VALUES ('ADMIN_APP_ADMIN', 'ADMIN', 'ADMIN_APP', 'AUTHZT_ALWAYS', 'AUTHZA_ALL', '', '2018-09-10 07:20:02.279');

