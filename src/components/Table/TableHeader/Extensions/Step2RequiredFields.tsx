import { IExtensionModalStepProps } from "./ExtensionModal";
import _sortBy from "lodash/sortBy";

import MultiSelect from "@rowy/multiselect";
import { ListItemIcon } from "@mui/material";

import { useProjectContext } from "contexts/ProjectContext";
import { FieldType } from "constants/fields";
import { getFieldProp } from "components/fields";

export default function Step2RequiredFields({
  extensionObject,
  setExtensionObject,
}: IExtensionModalStepProps) {
  const { tableState } = useProjectContext();

  return (
    <MultiSelect
      aria-label="Required fields"
      multiple
      value={extensionObject.requiredFields}
      disabled={!tableState?.columns}
      options={
        tableState?.columns
          ? _sortBy(Object.values(tableState!.columns), "index")
              .filter((c) => c.type !== FieldType.id)
              .map((c) => ({
                value: c.key,
                label: c.name,
                type: c.type,
              }))
          : []
      }
      onChange={(requiredFields) =>
        setExtensionObject((e) => ({ ...e, requiredFields }))
      }
      TextFieldProps={{ autoFocus: true }}
      freeText
      AddButtonProps={{ children: "Add other field…" }}
      AddDialogProps={{
        title: "Add other field",
        textFieldLabel: "Field key",
      }}
      itemRenderer={(option: {
        value: string;
        label: string;
        type?: FieldType;
      }) => (
        <>
          <ListItemIcon style={{ minWidth: 40 }}>
            {option.type && getFieldProp("icon", option.type)}
          </ListItemIcon>
          {option.label}
          <code style={{ marginLeft: "auto" }}>{option.value}</code>
        </>
      )}
    />
  );
}
