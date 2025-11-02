import {computed, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {UrlBuild} from '../interfaces/urlFormInterface.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  historyItems: WritableSignal<UrlBuild[]> = signal<UrlBuild[]>([]);
  filteredHistory: Signal<UrlBuild[]> = signal<UrlBuild[]>([]);
  filterText: WritableSignal<string> = signal('');
  selectedItem: WritableSignal<UrlBuild | null> = signal<UrlBuild | null>(null);

  constructor() {
    this.filteredHistory = computed(() => {
      const filter: string = this.filterText().toLowerCase().trim();

      // show all if no filter (sort by creation date).
      if (!filter) {
        return this.historyItems().sort((a: UrlBuild, b: UrlBuild) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      return this.historyItems().filter((item: UrlBuild) =>
        item.finalUrl.toLowerCase().includes(filter) ||
        item.form.baseUrl.toLowerCase().includes(filter)
      );
    });
    this.loadHistory();
  }

  post(body: UrlBuild): Promise<void> {
    return new Promise((resolve) => {
      // Read current history
      const current: UrlBuild[] = this.historyItems();

      // Add new item at the end and keep last 5
      const updated: UrlBuild[] = [...current, body].slice(-5);

      // Update signal
      this.historyItems.set(updated);

      // Save to localStorage
      localStorage.setItem('URLS', JSON.stringify(updated));

      resolve();
    });
  }

  loadHistory() {
    const saved: string | null = localStorage.getItem('URLS');
    if (saved) {
      try {
        this.historyItems.set(JSON.parse(saved));
      } catch {
        this.historyItems.set([]);
      }
    }
  }

  setSelectedUrlBuild(item: UrlBuild) {
    this.selectedItem.set(item)
  }
}
