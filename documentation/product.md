## Product question
*We want to make this component a reusable user-component that can be applied to various client projects, what would you propose to get towards that goal?*

The best bet would be to make it an independent component as a micro service. Depending on the functional requirements, the service need to be extended.

For example, if users could login from elsewhere, such as Github, additional data fields need to be added, such as an external id and external type.

Also, there is no authorization layer at this moment, everyone can use the API. This needs to be addressed to make it actually usable for different clients.
