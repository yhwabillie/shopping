import { create } from 'zustand'
import { AgreementSchemaType } from './zodSchema'

interface ModalType {
  modals: {
    addNewAddress: boolean
    editAddress: boolean
    postcode: boolean
    changeAddress: boolean
    alert: boolean
  }
}

//상태 모달 컨트롤
interface alertModalStore {
  modals: {
    error: boolean
    info: boolean
  }
  showModal: (modalName: keyof ModalType['modals']) => void
  hideModal: (modalName: keyof ModalType['modals']) => void
}

export const useAlertModalStore = create<alertModalStore>((set) => ({
  modals: {
    error: false,
    info: false,
  },
  showModal: (modalName) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: true,
      },
    })),
  hideModal: (modalName) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: false,
      },
    })),
}))

//모달 열기/닫기
type ModalState = {
  modalState: boolean
  setModalState: (data: boolean) => void
}

export const useModalStore = create<ModalState>((set) => ({
  modalState: false,
  setModalState: (data: boolean) => set({ modalState: data }),
}))

//동의 컨트롤
type AgreementState = {
  agreements: AgreementSchemaType
  setAgreement: (data: AgreementSchemaType) => void
}

export const useAgreementStore = create<AgreementState>((set) => ({
  agreements: {
    service_agreement: false,
    privacy_agreement: false,
    selectable_agreement: false,
  },
  setAgreement: (data: AgreementSchemaType) => set({ agreements: data }),
}))

//admin productlist
interface ProductState {
  productState: boolean
  setProductState: (data: boolean) => void
}

export const useProductStore = create<ProductState>((set) => ({
  productState: false,
  setProductState: (data: boolean) => set({ productState: data }),
}))

//body 스크롤 여부
interface BodyScrollStore {
  isBodyOverflowHidden: boolean
  disableScroll: () => void
  enableScroll: () => void
}

export const useBodyScrollStore = create<BodyScrollStore>((set) => ({
  isBodyOverflowHidden: false, // 초기 상태는 스크롤 활성화 (overflow: visible)

  // 스크롤 비활성화 함수
  disableScroll: () => {
    document.body.style.overflow = 'hidden'
    set({ isBodyOverflowHidden: true })
  },

  // 스크롤 활성화 함수
  enableScroll: () => {
    document.body.style.overflow = ''
    set({ isBodyOverflowHidden: false })
  },
}))

//submit loading
interface SubmitLoadingModalState {
  state: boolean
  setState: (data: boolean) => void
}

export const useSubmitLoadingModalStore = create<SubmitLoadingModalState>((set) => ({
  state: false,
  setState: (data: boolean) => set({ state: data }),
}))
