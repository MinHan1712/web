export interface IIrUiMenu {
  ir_ui_menu_id?: string;
  parent_path?: string;
  name?: string;
  active?: string;
  parent_id?: string;
  web_icon?: string;
  action?: string;
  create_uid?: string;
  create_date?: string;
  write_uid?: string;
  write_date?: string;
}

export interface IRoleMenu {
  id?: string;
  function_id?: string;
  function_code?: string;
  role_code?: string;
  role_id?: string;
  perm_read?: boolean;
  perm_write?: boolean;
  perm_delete?: boolean;
}

export interface IRoleInfoListMenu {
  active_flg?: boolean;
  role_code?: string;
  role_id?: string;
  level_role?: string;
  menu?: IRoleMenu[];
}

