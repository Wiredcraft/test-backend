module.exports = {
    getInsertDataSql(dbName) {
        return `
insert into \`${dbName}\`.\`User\` ( \`UserName\`, \`Password\`, \`FirstName\`, \`LastName\`, \`OrganizationName\`, \`Email\`, \`Sk\`, \`DatabaseSuffix\`, \`Domain\`, \`DefaultDomain\`, \`DefaultSubDomain\`, \`Cell\`, \`Address\`, \`PostCode\`, \`City\`, \`Province\`, \`Country\`, \`LastLoginDate\`, \`IsAdmin\`, \`IsTenant\`, \`IsFree\`, \`StripeProductId\`, \`SubscriptionWay\`, \`SubscriptionDue\`, \`Status\`, \`SubscriptionStatus\`, \`StripeCustomerId\`, \`StripeSubscriptionId\`, \`Creation\`, \`LastModified\`, \`deletedAt\`) values ( 'admin', 'e10adc3949ba59abbe56e057f20f883e', 'Super', 'Admin', '--', '289685629@qq.com', '497de9fd-634f-45d8-8110-2edbbcb766e2', null, null, null, null, null, null, null, null, null, 'Canada', null, '1', '0', '0', null, null, null, '1', '1', null, null, '2020-12-08 17:48:04', '2020-12-08 17:48:05', null);
insert into \`${dbName}\`.\`Role\` ( id, \`RoleName\`, \`Key\`, \`Description\`, \`Creation\`, \`LastModified\`, \`deletedAt\`) values ( 0, 'SuperAdmin', 'SuperAdmin', 'SuperAdmin', '2020-07-30 00:18:42', '2020-07-30 00:18:43', null);
insert into \`${dbName}\`.\`UserRole\` ( \`UserId\`, \`RoleId\`, \`Creation\`, \`LastModified\`) values (  '1', '0', '2020-08-05 16:54:33', '2020-08-05 16:54:35');
update \`${dbName}\`.\`Role\` set \`id\`='0', \`RoleName\`='SuperAdmin', \`Key\`='SuperAdmin', \`Description\`='SuperAdmin', \`Creation\`='2020-07-30 00:18:42', \`LastModified\`='2020-07-30 00:18:43', \`deletedAt\`=null where \`id\`='1';

insert into \`${dbName}\`.\`WebConfig\` ( id, \`Subdomain\`, \`Website\`, \`Tel\`, \`Address\`, \`PostalCode\`, \`Email\`, \`SendEmail\`, \`SendEmailPassword\`, \`SendEmailPort\`, \`Logo\`, \`Creation\`, \`LastModified\`, \`deletedAt\`, \`OrganizationName\`, \`SendEmailServer\`) values ( 1, 'ChangeMe', 'http://localhost:8000/', null, null, null, 'changeme@gmail.com', 'erpaims@neobizmb.com', 'eJ3Lukqmv3b', '465', '35', '2020-07-31 17:51:30', '2020-09-28 12:09:16', null, 'ChangeMe', 'smtp.exmail.qq.com');

`
    },
}