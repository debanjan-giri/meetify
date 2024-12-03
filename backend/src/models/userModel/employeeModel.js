import { Schema } from "mongoose";
import baseUserModel from "./baseUserModel.js";

const employeeSchema = new Schema({});

const employeeModel = baseUserModel.discriminator("employee", employeeSchema);

export default employeeModel;
