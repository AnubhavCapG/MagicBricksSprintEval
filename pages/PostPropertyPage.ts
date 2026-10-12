import { Page, Locator } from "@playwright/test";

export class PostPropertyPage {
  readonly page: Page;

  readonly pageHeading: Locator;

  readonly ownerOption: Locator;
  readonly agentOption: Locator;
  readonly builderOption: Locator;

  readonly sellOption: Locator;
  readonly rentOption: Locator;
  readonly pgOption: Locator;

  readonly propertyType: Locator;

  readonly totalFlats: Locator;
  readonly bedrooms: Locator;
  readonly balconies: Locator;
  readonly totalFloors: Locator;
  readonly furnishedStatus: Locator;
  readonly bathrooms: Locator;
  readonly floorsAllowed: Locator;
  readonly openSides: Locator;
  readonly roadWidth: Locator;

  readonly city: Locator;
  readonly project: Locator;
  readonly area: Locator;
  readonly floorNo: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageHeading = page.getByText("Sell or Rent your Property", {
      exact: true,
    });

    // User type
    this.ownerOption = page.getByText("Owner", { exact: true });
    this.agentOption = page.getByText("Agent", { exact: true });
    this.builderOption = page.getByText("Builder", { exact: true });

    // Replace these placeholders with your actual working IDs
    this.sellOption = page.locator("#propertyForS");
    this.rentOption = page.locator("#propertyForR");
    this.pgOption = page.locator("#propertyForP");

    // Property type
    this.propertyType = page.locator("#propertyType");

    // Property details
    // Replace placeholder IDs with the actual IDs from the page
    this.totalFlats = page.locator("#totalNoFlat");
    this.bedrooms = page.locator("#bedrooms");
    this.balconies = page.locator("#balconies");
    this.totalFloors = page.locator("#totalFloorNumber");
    this.floorNo = page.locator("#floorNumber");
    this.furnishedStatus = page.locator("#furnished");
    this.bathrooms = page.locator("#bathrooms");

    this.floorsAllowed = page.locator("#floorAllow");

    this.openSides = page.getByLabel("No. of open sides");
    this.roadWidth = page.getByLabel("Width of road facing plot");

    // Location — adjust if the page uses custom controls
    this.city = page.locator("#quickCity");
    this.project = page.locator("#projectSocietySelectForMA");
    this.area = page.locator("#sublocalityOne");
    //this.locality = page.locator("#locality");
    this.floorNo = page.locator("#floorNumber");
  }

  async openPostProperty(): Promise<void> {
    await this.page.goto(
      "/postproperty/post-property-for-sale-rent/residential-commercial",
    );
  }

  async selectOwner(): Promise<void> {
    await this.ownerOption.click();
  }

  async selectAgent(): Promise<void> {
    await this.agentOption.click();
  }

  async selectBuilder(): Promise<void> {
    await this.builderOption.click();
  }

  async selectSell(): Promise<void> {
    await this.sellOption.check();
  }

  async selectRent(): Promise<void> {
    await this.rentOption.check();
  }

  async selectPG(): Promise<void> {
    await this.pgOption.check();
  }

  async selectPropertyType(propertyType: string): Promise<void> {
    await this.propertyType.selectOption({ value: propertyType });
  }

  async selectTotalFlats(option: string): Promise<void> {
    const optionLabel = await this.totalFlats
      .locator("option")
      .evaluateAll(
        (options, value) =>
          options
            .find((element) => (element as HTMLOptionElement).value === value)
            ?.textContent?.trim(),
        option,
      );
    if (!optionLabel) {
      throw new Error(`No total-flats option found with value "${option}"`);
    }

    await this.page
      .locator("li.blOption")
      .getByText(optionLabel, { exact: true })
      .click();
  }

  async enterPropertyDetails(data: {
    totalFlats: string;
    bedrooms: string;
    balconies: string;
    floorNo: string;
    totalFloors: string;
    furnishedStatus: string;
    bathrooms: string;
    floorsAllowed: string;
    openSides: string;
    roadWidth: string;
  }): Promise<void> {
    await this.selectTotalFlats(data.totalFlats);

    await this.bedrooms.selectOption({ value: data.bedrooms });

    await this.balconies.selectOption({ value: data.balconies });

    await this.floorNo.selectOption({ value: data.floorNo });

    await this.totalFloors.selectOption({ value: data.totalFloors });

    await this.furnishedStatus.selectOption({ value: data.furnishedStatus });

    await this.bathrooms.selectOption({ value: data.bathrooms });

    await this.floorsAllowed.selectOption({ value: data.floorsAllowed });

  }

  async selectLocation(data: {
    city: string;
    project: string;
    area: string;
  }): Promise<void> {
    await this.city.fill("");
    await this.city.pressSequentially(data.city, { delay: 100 });

    await this.page
      .locator("#citySuggest")
      .getByText(data.city, { exact: true })
      .click();

    await this.project.pressSequentially(data.project, { delay: 100 });

    await this.project.press("ArrowDown");
    await this.project.press("Enter");

    await this.area.fill(data.area);
  }
}
