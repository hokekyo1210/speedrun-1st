import { Injectable } from "@angular/core";

export type VideoHost = 'Youtube'|'Twitch';

@Injectable()
export class VideoLinkService {

  private static DISCRIMINATOR: {[host: string]: VideoHost} = {
    ['youtu.be']: 'Youtube',
    ['www.youtube.com']: 'Youtube',
    ['www.twitch.tv']: 'Twitch',
  }

  private static EXTRACTOR: {[key: string]: (str:URL) => string} = {
    ['youtu.be']: VideoLinkService.extractVideoIdForYoutube,
    ['www.youtube.com']: VideoLinkService.extractVideoIdForYoutubeCom,
    ['www.twitch.tv']: VideoLinkService.extractVideoIdForTwitch,
  };

  private static extractVideoIdForYoutube(url: URL): string {
    const paths = url.pathname.split('/');
    return paths[paths.length - 1];
  }

  private static extractVideoIdForYoutubeCom(url: URL): string {
    if(url.searchParams.has('v'))
      return url.searchParams.get('v');
    return "";
  }

  private static extractVideoIdForTwitch(url: URL): string {
    const videoId = VideoLinkService.extractVideoIdForYoutube(url);
    return videoId;
  }

  /**
   * VideoIdの取得
   * @param record
   */
  public getVideoId(url: URL): string {
    return VideoLinkService.EXTRACTOR[url.host](url);
  }

  /**
   * VideoHostの判別
   * @param record
   */
  public getVideoHost(url: URL): VideoHost {
    return VideoLinkService.DISCRIMINATOR[url.host];
  }

  public getThumbnailUrl(url: URL) {
    try {
      const videHost = this.getVideoHost(url);
      if(videHost == 'Youtube') {
        const videoId = this.getVideoId(url);
        return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
      } else if(videHost == 'Twitch') {
        const videoId = this.getVideoId(url);
        // cant found thumbnail api ...
      }
    } catch (error) {
      return "";
    }
    return "";
  }

}
