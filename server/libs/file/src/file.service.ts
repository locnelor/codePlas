import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';

@Injectable()
export class FileService {
  constructor() { }
  public static readonly Root = cwd();
  public static getSSLKey() {
    return readFileSync(join(this.Root, "keys", "ssh.key"))
  }
  public static getSSLPem() {
    return readFileSync(join(this.Root, "keys", "ssh.pem"))
  }
  public readonly Assets = join(FileService.Root, "assets")
  private readonly configFile = join(this.Assets, "config.json")
  public join(...paths: string[]) {
    return join(...paths)
  }
  public make(name: string) {
    return this.mkdir(join(this.Assets, name))
  }
  public getConfig() {
    try {
      return JSON.parse(readFileSync(this.configFile).toString());
    } catch (err) {
      console.log(`lib(file.service): ${err.message}`)
    }
    return null;
  }
  public setConfig(config: Object) {
    if (!existsSync(this.configFile)) {
      mkdirSync(join(this.configFile, ".."), { recursive: true })
    }
    writeFileSync(this.configFile, JSON.stringify(config))
  }
  public writeFile(path: string, data: any) {
    if (!existsSync(path)) {
      mkdirSync(join(path, ".."), { recursive: true })
    }
    writeFileSync(path, data)
  }
  public exists(path: string) {
    return existsSync(path)
  }
  public mkdir(path: string) {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true })
    }
    return path;
  }
  public destoryDirOrFile(path: string) {
    if (!existsSync(path)) return;
    const stat = statSync(path);
    if (stat.isFile()) {
      unlinkSync(path)
      return;
    }
    const names = readdirSync(path);
    for (const name of names) {
      this.destoryDirOrFile(join(path, name))
    }
    rmdirSync(path)
  }

  public getFileContext(path: string) {
    if (!existsSync(path)) return null;
    return readFileSync(path)
  }

  public base64_to_buffer(base64: string) {
    const base64Content = base64.includes(",") ? base64.split(",")[1] : base64;
    const buffer = Buffer.from(base64Content, "base64");
    return buffer;
  }
}
