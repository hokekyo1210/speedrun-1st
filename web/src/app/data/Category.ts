
export class Category {
  categoryId: string;
  gameId: string;
  categoryName: string;
  subCategoryName: string;
  categoryUrl: string;

  bestPalyerName: string;
  bestTime: string;
  bestVideoLink: string;
  bestDate: Date;

  constructor(init?: Partial<Category>) {
    Object.assign(this, init);
  }

  /**
   * getVideoId
   */
  public getVideoId(): string {
    const url = new URL(this.bestVideoLink);

    if(url.searchParams.has("v")) {
      return url.searchParams.get("v");
    }

    return null;
  }

}
