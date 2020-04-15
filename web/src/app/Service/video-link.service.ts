import { Injectable } from "@angular/core";

export type VideoHost = 'Youtube'|'Twitch'|'Bilibili';

@Injectable()
export class VideoLinkService {

  private static EXTRACTOR: {[key: string]: (str:URL) => string} = {
    ['youtu.be']: VideoLinkService.extractVideoIdForYoutube,
    ['www.youtube.com']: VideoLinkService.extractVideoIdForYoutubeCom,
    ['www.twitch.tv']: VideoLinkService.extractVideoIdForTwitch,
    ['www.bilibili.com']: VideoLinkService.extractVideoIdForBilibili,
  };

  // https://youtu.be/XXXXXXXXXXX
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

  // https://www.bilibili.com/video/avXXXXXXXX/
  private static extractVideoIdForBilibili(url: URL): string {
    const paths = url.pathname.split('/');
    return paths[2].substring(2);
  }

  /**
   * VideoIdの取得
   * @param record
   */
  public getVideoId(url: URL): string {
    return VideoLinkService.EXTRACTOR[url.host](url);
  }

  private static DISCRIMINATOR: {[host: string]: VideoHost} = {
    ['youtu.be']: 'Youtube',
    ['www.youtube.com']: 'Youtube',
    ['www.twitch.tv']: 'Twitch',
    ['www.bilibili.com']: 'Bilibili',
  }

  /**
   * VideoHostの判別
   * @param record
   */
  public getVideoHost(url: URL): VideoHost {
    return VideoLinkService.DISCRIMINATOR[url.host];
  }

  /**
   * サムネイルURLの取得
   * @param url
   */
  public getThumbnailUrl(url: URL) {
    try {
      const videHost = this.getVideoHost(url);
      if(videHost == 'Youtube') {
        const videoId = this.getVideoId(url);
        return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
      } else if(videHost == 'Twitch') {
        const videoId = this.getVideoId(url);
        // cant found thumbnail api ...
      } else if(videHost == 'Bilibili') {
        const videoId = this.getVideoId(url);
        // cant unserstand thumbnail url pattern ...
      }
    } catch (error) {
      return "";
    }
    return "";
  }


  private static readonly THMBNAIL_URL_BASE = './assets/image/movie-default-thumbnail/';
  private static readonly THUMBNAIL_URL: {[key: string]: string} = {
    ['youtu.be']: VideoLinkService.THMBNAIL_URL_BASE + 'youtube.png',
    ['www.youtube.com']: VideoLinkService.THMBNAIL_URL_BASE + 'youtube.png',
    ['www.twitch.tv']: VideoLinkService.THMBNAIL_URL_BASE + 'twitch.png',
    ['www.bilibili.com']: VideoLinkService.THMBNAIL_URL_BASE + 'bilibili.png',
    ['default']: VideoLinkService.THMBNAIL_URL_BASE + 'default.png',
  }

  /**
   * サムネイルを取得できなかった場合の画像URL
   * @param url
   */
  public getDefaultThmbnailUrl(url: URL) {
    let host = 'default';
    if(url != null && url.host in VideoLinkService.THUMBNAIL_URL) {
      host = url.host;
    }

    return VideoLinkService.THUMBNAIL_URL[host];
  }

}
