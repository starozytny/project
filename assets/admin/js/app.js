import '../css/app.scss';
import '@commonFunctions/toastrOptions';

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from 'react';
import { render } from 'react-dom';
import { Notifications } from "@tailwindComponents/Modules/Notifications/Notifications";

Routing.setRoutingData(routes);

const notifications = document.getElementById("notifications");
if(notifications){
    render(<Notifications {...notifications.dataset} isImmo={false} />, notifications)
}
