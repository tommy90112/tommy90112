import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { AVAILABILITY, formatAvailableFrom, isAvailableNow } from '@/data/site'

/**
 * Job-search state for the surfaces that show it.
 *
 * The start-date line is derived, never written out: before the date it offers
 * one, from the date onwards it says "available immediately". A hardcoded
 * "Available from Sep 2026" would quietly turn into a stale claim the moment
 * September passed, and nothing would prompt a fix.
 */
export function useAvailability(): {
  isOpen: ComputedRef<boolean>
  status: ComputedRef<string>
  detail: ComputedRef<string>
  timing: ComputedRef<string>
} {
  const { t, locale } = useI18n()

  return {
    isOpen: computed(() => AVAILABILITY.openToWork),
    status: computed(() => t('availability.status')),
    detail: computed(() => t('availability.detail')),
    timing: computed(() =>
      isAvailableNow()
        ? t('availability.availableNow')
        : t('availability.availableFrom', { date: formatAvailableFrom(locale.value) }),
    ),
  }
}
