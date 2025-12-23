import express from 'express'
import { isCustomer } from '../middleware/rolebase';
import { serviceRequest } from '../controller/serviceRequest';
const serviceRequest = express();

serviceRequest.post('/', isCustomer,  serviceRequest);