import { render, screen, act } from "@testing-library/react";
import { I18nProvider } from "../../../../i18n/I18nProvider";
import { StoreLayout } from "../StoreLayout";

function renderStoreLayout() {
  return render(
    <I18nProvider>
      <StoreLayout />
    </I18nProvider>
  );
}

describe("Store Layout", () => {
  it("renders the logo image", () => {
    renderStoreLayout();
    expect(screen.getByAltText("ambrosia")).toBeInTheDocument();
  });

  it("renders the navbar elements", async () => {
    await act(async () => {
      renderStoreLayout();
    });
    expect(screen.getByText("users")).toBeInTheDocument();
    expect(screen.getByText("products")).toBeInTheDocument();
    expect(screen.getByText("checkout")).toBeInTheDocument();
    expect(screen.getByText("settings")).toBeInTheDocument();
  });
});
