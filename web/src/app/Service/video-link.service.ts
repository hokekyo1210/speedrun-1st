import { Injectable } from "@angular/core";
import { ImgSrcDirective } from '@angular/flex-layout';

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

  /**
   * サムネイルURLの取得
   * @param url
   */
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


  private static readonly THMBNAIL_URL_BASE = './assets/movie-default-thumbnail/';
  private static readonly THUMBNAIL_URL: {[key: string]: string} = {
    ['youtu.be']: VideoLinkService.THMBNAIL_URL_BASE + 'youtube.png',
    ['www.youtube.com']: VideoLinkService.THMBNAIL_URL_BASE + 'youtube.png',
    ['www.twitch.tv']: VideoLinkService.THMBNAIL_URL_BASE + 'twitch.png',
    ['default']: VideoLinkService.THMBNAIL_URL_BASE + 'default.png',
  }

  /**
   * サムネイルを取得できなかった場合の画像URL
   * @param url
   */
  public getDefaultThmbnailUrl(url: URL) {
    try {
      return VideoLinkService.THUMBNAIL_URL[url.host];
    } catch(error) {
      // 握りつぶしても問題なし
    }
    return VideoLinkService.THUMBNAIL_URL['default'];
  }

}
