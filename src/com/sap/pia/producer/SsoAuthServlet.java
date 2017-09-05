package com.sap.pia.producer;

import java.io.IOException;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Servlet implementation class SsoAuthServlet
 */
public class SsoAuthServlet extends HttpServlet
{
	private static final long serialVersionUID= 1L;

	/**
	 * Static constant Logger object used for adding various logs .
	 */
	private static final Logger LOGGER= LoggerFactory.getLogger(SsoAuthServlet.class);

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SsoAuthServlet()
	{
		super();

	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

	}

	/**
	 * This method return SSO authenticate user and role vale
	 * 
	 * @param request
	 *            an HttpServletRequest object that contains the request the
	 *            client has made of the servlet
	 * @param response
	 *            an HttpServletResponse object that contains the response the
	 *            servlet sends to the client
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{

		GetLoginUser getLoginUser= null;
		String userName= "{\"UserName\":";
		String roleAccess= ",\"hasRole\":";
		try
		{
			getLoginUser= new GetLoginUser(request);
			userName+= "\"" + getLoginUser.doGetUserName() + "\"";
			roleAccess+= "\"" + getLoginUser.hasDefinedRole() + "\"}";
			OdataUtility.responseMessage= userName + roleAccess;
			response.setStatus(HttpServletResponse.SC_OK);
			OdataUtility.writeToResponse(response);
		}
		catch(NamingException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}

	}
}
