import { CreateDashboardDto } from "./create-dashboard.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateDashboardDto extends PartialType(CreateDashboardDto){}