/**
 * Proj. test-backend
 *
 * @author Yarco Wang <yarco.wang@gmail.com>
 * @since 2019/12/20 11:09 AM
 */
import {ApiModelProperty} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class AuthCredentialDto {
    @ApiModelProperty()
    username: string;

    @ApiModelProperty()
    password: string;
}
