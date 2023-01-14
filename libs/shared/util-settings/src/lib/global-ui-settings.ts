import { Injectable } from '@angular/core';

export interface UISettings {
  lowCPU: boolean;
  animation: string;
  showTooltips: boolean;
  tooltipKeyControl: boolean;
  tooltipDelay: number;
}

@Injectable({
  providedIn: 'root',
})
export class GlobalUISettingsService {
  private showTooltips = true;
  public get ShowTooltips(): boolean {
    return this.showTooltips;
  }
  public set ShowTooltips(v: boolean) {
    this.showTooltips = v;
    this.SaveSettings();
  }

  private tooltipKeyControl = true;
  public get TooltipKeyControl(): boolean {
    return this.tooltipKeyControl;
  }
  public set TooltipKeyControl(v: boolean) {
    this.tooltipKeyControl = v;
    this.SaveSettings();
  }

  private tooltipDelay = 600;
  public get TooltipDelay(): number {
    return this.tooltipDelay;
  }
  public set TooltipDelay(v: number) {
    this.tooltipDelay = v;
    this.SaveSettings();
  }

  private lowCPU = true;
  public get LowCPU(): boolean {
    return this.lowCPU;
  }
  public set LowCPU(v: boolean) {
    this.lowCPU = v;
    this.SaveSettings();
  }

  public readonly animations = ['none', 'zoom', 'slide', 'fade'];
  private animationType = '';
  public get AnimationType(): string {
    return this.animationType;
  }
  public set AnimationType(animation: any) {
    if (this.animations.includes(animation.value, 1)) {
      this.animationType = 'animate-' + animation.value + 'In';
    } else {
      this.animationType = '';
    }
    this.SaveSettings();
  }

  constructor() {
    const localStoreSettingsString = localStorage.getItem('localUISettings');
    if (localStoreSettingsString === null) {
      return;
    }
    const savedSettings = JSON.parse(localStoreSettingsString);
    this.animationType = savedSettings.animation;
    this.LowCPU = savedSettings.lowCPU;
    this.ShowTooltips = savedSettings.showTooltips;
    this.tooltipKeyControl = savedSettings.tooltipKeyControl;
    this.TooltipDelay = savedSettings.tooltipDelay;
  }

  private SaveSettings(): void {
    const newSettings: UISettings = {
      lowCPU: this.lowCPU,
      animation: this.animationType,
      showTooltips: this.showTooltips,
      tooltipKeyControl: this.tooltipKeyControl,
      tooltipDelay: this.tooltipDelay,
    };
    localStorage.setItem('localUISettings', JSON.stringify(newSettings));
  }

  public resetSettings(): void {
    localStorage.removeItem('localUISettings');
    this.lowCPU = true;
    this.showTooltips = true;
    this.tooltipKeyControl = false;
    this.tooltipDelay = 600;
    this.animationType = '';
  }
}
