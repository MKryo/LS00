"""This is a models program."""
# encoding: utf-8

import numpy as np
import scipy.stats as st
import math
np.seterr(divide='ignore', invalid='ignore')


# TypeHintsによる型アノテーション。
# samplesの型がnp.ndarray、このメソッドの戻り値がtupleであることを示す。
def convert_array(samples: np.ndarray) -> tuple:
    # samples(np.ndarray) -> (a,b,c,d)(tuple)
    # print("ca is :" + str(type(samples)) + "  tuple is :" +
    #       str(type((1, 2))) + "  str:" + str(type("aaas")))
    return (samples[0], samples[1], samples[2], samples[3])


def paris(samples):
    """ pARIs method """
    a, b, c, d = convert_array(samples)
    res = a / (a + b + c)
    return res


def dfh(samples):
    """ DFH method """
    a, b, c, d = convert_array(samples)
    res = a / (math.sqrt((a + b) * (a + c)))
    return res


def phi(samples):
    """ phi-coefficient method """
    a, b, c, d = convert_array(samples)
    res = ((a * d) - (b * c)) / math.sqrt((a + b) * (c + d) * (a + c) * (b + d))
    return res


def deltap(samples):
    a, b, c, d = convert_array(samples)
    res = (a * d - b * c) / ((a + b) * (c + d))
    return res


def phi_sq(samples):
    """ phi-coefficient method """
    a, b, c, d = convert_array(samples)
    res = ((a * d) - (b * c)) / np.sqrt((a + b) * (c + d) * (a + c) * (b + d))
    return res * res


def deltap_sq(samples):
    a, b, c, d = convert_array(samples)
    res = (a * d - b * c) / ((a + b) * (c + d))
    return res * res


def ls(samples):
    a, b, c, d = convert_array(samples)
    gamma = a / (a + c)
    delta = b / (b + d)
    num = a + delta * d
    den = num + b + gamma * c
    res = num / den
    return res


def ppc(samples):
    a, b, c, d = convert_array(samples)
    res = (a * d - b * c) / ((a + b) * d)
    return res


def ppc_c(samples):
    a, b, c, d = convert_array(samples)
    res = (a * d - b * c) / ((a + c) * d)
    return res


def pr_e_given_c(samples):
    a, b, c, d = convert_array(samples)
    res = a / (a + b)
    return res


def pr_c_given_e(samples):
    a, b, c, d = convert_array(samples)
    res = a / (a + c)
    return res


def pr_c_pr_e(samples):
    a, b, c, d = convert_array(samples)
    n = (a + b + c + d)
    res = (a + b) / n * (a + c) / n
    return res


def pr_c_and_e(samples):
    a, b, c, d = convert_array(samples)
    n = (a + b + c + d)
    res = a / n
    return res


def mean_cond(samples):
    a, b, c, d = convert_array(samples)
    res = ((a / (a + b)) + (a / (a + c))) / 2
    return res


def pci(samples):
    a, b, c, d = convert_array(samples)
    res = (a + d) / (a + b + c + d)
    return res


def dr(samples):
    a, b, c, d = convert_array(samples)
    res = (a * a) / ((a + b) * (a + c))
    return res


def pr_c(samples):
    a, b, c, d = convert_array(samples)
    res = a / (a + b)
    return res


def chi2(samples):
    a, b, c, d = convert_array(samples)
    chi2_v = (a + b + c + d) \
        * math.pow((a * d - b * c), 2) \
        / ((a + b) * (c + d) * (a + c) * (b + d))
    chi2_p = 1 - st.chi2.cdf(chi2_v, 1)
    return chi2_p


def mi(samples):
    a, b, c, d = convert_array(samples)
    N = (a + b + c + d)
    res = (a / N) * np.log2((a + b) * (a + c) / (a * N))
    + (b / N) * np.log2((a + b) * (b + d) / (b * N))
    + (c / N) * np.log2((c + d) * (a + c) / (c * N))
    + (d / N) * np.log2((c + d) * (b + d) / (d * N))
    return res


def mi_der(samples):  # 派生(derivation)
    a, b, c, d = convert_array(samples)
    N = (a + b + c + d)
    res = (a / N) * np.log2((a + b) * (a + c) / (a * N))
    return res


def paris_der(samples):
    a, b, c, d = convert_array(samples)
    res = a / (a + b + c)
    + b / (b + a + d)
    + c / (c + d + a)
    + d / (d + c + b)
    return res


def phi0(contingencyt):
    """ phi0 is True population phi """
    # this function require ContingencyTable of instanse. ##
    # return contingencyt.get_prob_ce()  # なんで？？？？？
    return contingencyt.get_phi0()


def paris0(contingencyt):
    return contingencyt.get_paris0()


def deltap0(contingencyt):
    return contingencyt.get_deltap0()


def dr0(contingencyt):
    return contingencyt.get_dr0()


def phi0_sq(contingencyt):
    p0 = contingencyt.get_phi0()
    return p0 * p0


def mi0(contingencyt):  # 相互情報量
    return contingencyt.get_mi0()
