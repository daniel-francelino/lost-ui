import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { FormBuilder } from "../components/forms/form-builder";
import { FormColorPicker } from "../components/forms/form-color-picker";
import { FormCountrySelect } from "../components/forms/form-country-select";
import { FormEmojiPicker } from "../components/forms/form-emoji-picker";
import { FormFileUpload } from "../components/forms/form-file-upload";
import { FormInputDate } from "../components/forms/form-input-date";
import { FormInputMenu } from "../components/forms/form-input-menu";
import { FormInputNumber } from "../components/forms/form-input-number";
import { FormInputPhone } from "../components/forms/form-input-phone";
import { FormInputTags } from "../components/forms/form-input-tags";
import { FormSelectMenu } from "../components/forms/form-select-menu";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../components/ui/dialog";
import { PaginationNext, PaginationPrevious } from "../components/ui/pagination";
import { LostI18nProvider, lostI18n } from ".";

afterEach(async () => {
  await lostI18n.changeLanguage("en");
});

const inLanguage = (language: string, ui: ReactNode) =>
  render(<LostI18nProvider language={language}>{ui}</LostI18nProvider>);

describe("the texts of the components", () => {
  it("shows the date field in Portuguese and Spanish", () => {
    const { unmount } = inLanguage("pt", <FormInputDate label="Data" />);
    expect(screen.getByRole("button", { name: /Escolher uma data/ })).toBeInTheDocument();
    unmount();

    inLanguage("es", <FormInputDate label="Fecha" />);
    expect(screen.getByRole("button", { name: /Elegir una fecha/ })).toBeInTheDocument();
  });

  it("lets a text given by prop win over the translation", () => {
    inLanguage("pt", <FormInputDate label="Data" placeholder="Pick one" />);
    expect(screen.getByRole("button", { name: /Pick one/ })).toBeInTheDocument();
  });

  it("translates the time field and the clear button of the date", async () => {
    const user = userEvent.setup();
    inLanguage(
      "pt",
      <FormInputDate label="Data" time clearable defaultValue={new Date(2026, 0, 15, 9, 0)} />,
    );

    expect(screen.getByRole("button", { name: "Limpar data" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /15/ }));
    expect(await screen.findByLabelText("Hora")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Concluir" })).toBeInTheDocument();
  });

  it("translates the buttons of the form builder", () => {
    inLanguage("pt", <FormBuilder fields={[]} showReset />);
    expect(screen.getByRole("button", { name: "Enviar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Limpar" })).toBeInTheDocument();
  });

  it("keeps the labels the builder is given", () => {
    inLanguage("pt", <FormBuilder fields={[]} submitLabel="Save" />);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("translates the number controls", () => {
    inLanguage("es", <FormInputNumber label="Cantidad" />);
    expect(screen.getByRole("button", { name: "Aumentar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Disminuir" })).toBeInTheDocument();
  });

  it("translates the select menu placeholder and the count of selected items", () => {
    const { unmount } = inLanguage("pt", <FormSelectMenu label="Cor" items={["a", "b"]} />);
    expect(screen.getByRole("combobox", { name: /Selecionar…/ })).toBeInTheDocument();
    unmount();

    inLanguage(
      "pt",
      <FormSelectMenu
        label="Cor"
        items={["a", "b", "c"]}
        multiple
        defaultValue={["a", "b", "c"]}
      />,
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("3 selecionados");
  });

  it("translates the empty list and the create option of the input menu", async () => {
    const user = userEvent.setup();
    inLanguage("pt", <FormInputMenu label="Cidade" items={["Lisboa"]} creatable />);

    await user.type(screen.getByRole("combobox"), "xyz");

    expect(await screen.findByRole("status")).toHaveTextContent("Criar “xyz”");
  });

  it("translates the no-results text of a list", async () => {
    const user = userEvent.setup();
    inLanguage("es", <FormInputMenu label="Ciudad" items={["Lisboa"]} />);

    await user.type(screen.getByRole("combobox"), "xyz");

    expect(await screen.findByRole("status")).toHaveTextContent("Sin resultados");
  });

  it("translates the remove button of a tag with its name", () => {
    inLanguage("pt", <FormInputTags label="Tags" defaultValue={["ótimo"]} />);
    expect(screen.getByRole("button", { name: "Remover ótimo" })).toBeInTheDocument();
  });

  it("translates the drop zone and the remove button of a file", () => {
    inLanguage("es", <FormFileUpload label="Archivos" />);
    expect(
      screen.getByText("Suelta los archivos aquí o haz clic para elegirlos"),
    ).toBeInTheDocument();
  });

  it("translates the colour picker", () => {
    inLanguage("pt", <FormColorPicker label="Cor" swatches={["#ff0000"]} />);
    expect(screen.getByLabelText("Escolher uma cor")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Amostras" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Usar #ff0000" })).toBeInTheDocument();
  });

  it("translates the phone field", async () => {
    inLanguage("es", <FormInputPhone label="Teléfono" />);
    expect(screen.getByRole("combobox", { name: "Prefijo del país" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Número de teléfono")).toBeInTheDocument();
  });

  it("translates the country and emoji fields", () => {
    const { unmount } = inLanguage("pt", <FormCountrySelect label="País" />);
    expect(screen.getByPlaceholderText("Pesquisar um país")).toBeInTheDocument();
    unmount();

    inLanguage("pt", <FormEmojiPicker label="Ícone" />);
    expect(screen.getByRole("button", { name: /Escolher um emoji/ })).toBeInTheDocument();
  });

  it("translates the pagination", () => {
    inLanguage(
      "es",
      <>
        <PaginationPrevious href="#" />
        <PaginationNext href="#" />
      </>,
    );
    expect(screen.getByRole("link", { name: "Ir a la página anterior" })).toHaveTextContent(
      "Anterior",
    );
    expect(screen.getByRole("link", { name: "Ir a la página siguiente" })).toHaveTextContent(
      "Siguiente",
    );
  });

  it("translates the close button of a dialog", () => {
    inLanguage(
      "pt",
      <Dialog open>
        <DialogContent>
          <DialogTitle>Título</DialogTitle>
          <DialogDescription>Descrição</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
  });

  it("changes the texts of a field that is already on screen", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <LostI18nProvider language="en">
        <FormInputNumber label="Quantity" />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("button", { name: "Increment" })).toBeInTheDocument();

    rerender(
      <LostI18nProvider language="pt">
        <FormInputNumber label="Quantity" />
      </LostI18nProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Aumentar" }));
    expect(screen.getByRole("spinbutton")).toHaveValue("1");
  });
});
