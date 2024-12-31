import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Language,
  type LanguagesSchema,
} from "@/server/data/languages-dto";

export function ProgrammingLanguageSelector(props: {
  languages: LanguagesSchema;
  selectedLanguageId: number;
  onSelectLanguageChange: (value: number) => void;
}) {
  const { languages, selectedLanguageId, onSelectLanguageChange } = props;
  return (
    <Select
      value={convertIdToStringRepresentation(selectedLanguageId)}
      onValueChange={(value) =>
        onSelectLanguageChange(convertStringIdToNumberRepresentation(value))
      }
    >
      <SelectTrigger className="m-1 w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Lenguajes de programación</SelectLabel>
          {languages.map(createLanguageItem)}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function createLanguageItem(language: Language) {
  return (
    <SelectItem
      value={convertIdToStringRepresentation(language.id)}
      key={language.id}
    >
      {language.name}
    </SelectItem>
  );
}

function convertIdToStringRepresentation(id: number) {
  return id.toString();
}

function convertStringIdToNumberRepresentation(id: string) {
  return parseInt(id);
}
